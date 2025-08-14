import { AgentType } from './types';
import { IChatModel } from './IChatModel';
import { OpenAIChatModel } from './openai';
import { GeminiChatModel } from './gemini';
import { DeepseekChatModel } from './deepseek';

/**
 * Returns a chat model instance based on the current plan or agent type.
 * The provider can be configured via env variables:
 * - `<AGENT>_PROVIDER` (e.g. TUTOR_PROVIDER="gemini")
 * - `CHAT_PROVIDER` for a global default provider
 *
 * Model names can be overridden via `<AGENT>_MODEL` env variables.
 */
export function getChatModel(agentType: AgentType): IChatModel {
  const providerKey = `${agentType.toUpperCase()}_PROVIDER`;
  const provider =
    (process.env[providerKey] || process.env.CHAT_PROVIDER || 'openai').toLowerCase();

  const modelKey = `${agentType.toUpperCase()}_MODEL`;
  const model = process.env[modelKey];

  switch (provider) {
    case 'gemini':
      return new GeminiChatModel(model);
    case 'deepseek':
      return new DeepseekChatModel(model);
    default:
      return new OpenAIChatModel(model);
  }
}
