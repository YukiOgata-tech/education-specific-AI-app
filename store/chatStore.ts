import { create } from 'zustand';
import { AgentType } from '../scripts/api/types';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export interface ChatThread {
  threadId: string;
  agentType?: AgentType;
  messages: ChatMessage[];
}

interface ChatState {
  threads: Record<string, ChatThread>;
  createThread: (threadId: string) => void;
  addMessage: (threadId: string, message: ChatMessage) => void;
  setAgentType: (threadId: string, agent: AgentType) => void;
  getThread: (threadId: string) => ChatThread | undefined;
}

export const useChatStore = create<ChatState>((set, get) => ({
  threads: {},
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
  addMessage: (threadId, message) => {
    const current = get().threads[threadId] ?? { threadId, messages: [] };
    set((state) => ({
      threads: {
        ...state.threads,
        [threadId]: {
          ...current,
          messages: [...current.messages, message],
        },
      },
    }));
  },
  setAgentType: (threadId, agent) =>
    set((state) => {
      const thread = state.threads[threadId];
      if (!thread) return state;
      return {
        threads: {
          ...state.threads,
          [threadId]: { ...thread, agentType: agent },
        },
      };
    }),
  getThread: (threadId) => get().threads[threadId],
}));
