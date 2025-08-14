import OpenAI from 'openai';
import { IChatModel, Message } from './IChatModel';

export class OpenAIChatModel implements IChatModel {
  private client: OpenAI;
  private model: string;

  constructor(model: string = process.env.OPENAI_MODEL || 'gpt-4o-mini') {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.model = model;
  }

  async send(prompt: string, history: Message[] = []): Promise<string> {
    const res = await this.client.responses.create({
      model: this.model,
      input: [
        ...history.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: prompt },
      ],
    });
    return res.output_text ?? '';
  }
}
