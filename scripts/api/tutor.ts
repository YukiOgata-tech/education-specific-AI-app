import OpenAI from 'openai';
import { ChatMessage } from '../../store/chatStore';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.TUTOR_MODEL || 'gpt-4o-mini';

export async function tutor(messages: ChatMessage[]): Promise<string> {
  const res = await client.responses.create({
    model: MODEL,
    input: messages.map((m) => ({ role: m.role, content: m.content })),
  });
  return res.output_text ?? '';
}
