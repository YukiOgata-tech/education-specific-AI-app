import { IChatModel, Message } from './IChatModel';

export class DeepseekChatModel implements IChatModel {
  private model: string;
  private apiKey: string;
  private endpoint: string;

  constructor(model: string = process.env.DEEPSEEK_MODEL || 'deepseek-chat') {
    this.model = model;
    this.apiKey = process.env.DEEPSEEK_API_KEY || '';
    this.endpoint =
      process.env.DEEPSEEK_ENDPOINT || 'https://api.deepseek.com/chat/completions';
  }

  async send(prompt: string, history: Message[] = []): Promise<string> {
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        messages: [...history, { role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      throw new Error(`Deepseek API error: ${res.status}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? '';
  }
}
