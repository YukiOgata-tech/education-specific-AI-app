import { create } from 'zustand';

import { classifyTopic } from '../scripts/api/commander';
import type { AgentType } from '../scripts/api/types';

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
  appendMessage: (id: string, message: ChatMessage) => Promise<void>;
  getThreadById: (id: string) => ChatThread | undefined;
}

export const useChatStore = create<ChatState>((set, get) => ({
  threads: {},
  appendMessage: async (id, message) => {
    const existing = get().threads[id] ?? { id, messages: [] };
    const isFirst = existing.messages.length === 0 && message.role === 'user';

    // add the message immediately
    set((state) => ({
      threads: {
        ...state.threads,
        [id]: {
          ...existing,
          id,
          messages: [...existing.messages, message],
        },
      },
    }));

    if (isFirst) {
      const agentType = await classifyTopic(message.content);
      set((state) => ({
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

