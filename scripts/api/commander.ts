import OpenAI from 'openai';
import { AgentType, AGENT_TYPES } from './types';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const DEFAULT_AGENT: AgentType = 'tutor';
const MODEL = process.env.TOPIC_MODEL || 'gpt-4o-mini';

export async function classifyTopic(
  text: string,
  fallback: AgentType = DEFAULT_AGENT,
): Promise<AgentType> {
  try {
    const prompt = `Classify the user's request into one of: tutor, counselor, planner.\n\nText: ${text}\nLabel:`;
    const res = await client.responses.create({
      model: MODEL,
      input: prompt,
      max_output_tokens: 1,
    });

    const label = res.output_text?.trim().toLowerCase();
    if (AGENT_TYPES.includes(label as AgentType)) {
      return label as AgentType;
    }
  } catch (err) {
    console.error('Topic classification failed:', err);
  }
  return fallback;
}
