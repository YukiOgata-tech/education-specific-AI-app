import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AgentType } from '../scripts/api/types';


export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export interface ChatThread {
  id: string;
  agentType?: AgentType;
  messages: ChatMessage[];
}

interface ChatState {
  threads: Record<string, ChatThread>;

  createThread: (threadId: string) => void;
  addMessage: (threadId: string, message: ChatMessage) => Promise<void>;
  loadThread: (threadId: string) => Promise<void>;
  setAgentType: (threadId: string, agent: AgentType) => void;
  getThread: (threadId: string) => ChatThread | undefined;
}

export const useChatStore = create<ChatState>((set, get) => ({
  threads: {},

  loadThread: async (threadId) => {
    const existing = get().threads[threadId];
    if (existing) return;
    const stored = await AsyncStorage.getItem(`thread-${threadId}`);
    if (stored) {
      const messages: ChatMessage[] = JSON.parse(stored);
      set((state) => ({
        threads: {
          ...state.threads,
          [threadId]: { threadId, messages },
        },
      }));
    } else {
      set((state) => ({
        threads: {
          ...state.threads,
          [threadId]: { threadId, messages: [] },
        },
      }));
    }
  },
  createThread: (threadId) => {
    const existing = get().threads[threadId];
    if (existing) return;
    set((state) => ({
      threads: {
        ...state.threads,
        [threadId]: { threadId, messages: [] },
      },
    }));
  },
  addMessage: async (threadId, message) => {
    const current = get().threads[threadId] ?? { threadId, messages: [] };
    const updated: ChatThread = {
      ...current,
      messages: [...current.messages, message],
    };
    set((state) => ({
      threads: {
        ...state.threads,
        [threadId]: updated,
      },
    }));
    await AsyncStorage.setItem(
      `thread-${threadId}`,
      JSON.stringify(updated.messages)
    );
  },
  setAgentType: (threadId, agent) =>
    set((state) => {
      const thread = state.threads[threadId];
      if (!thread) return state;
      return {

        threads: {
          ...state.threads,
          [id]: {
            ...state.threads[id],
            agentType,
          },
        },
      }));
    }
  },
  getThreadById: (id) => get().threads[id],
}));

