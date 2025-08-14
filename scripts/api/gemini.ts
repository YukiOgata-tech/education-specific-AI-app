import { GoogleGenerativeAI } from '@google/generative-ai';
import { IChatModel, Message } from './IChatModel';

export class GeminiChatModel implements IChatModel {
  private model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>;

  constructor(model: string = process.env.GEMINI_MODEL || 'gemini-1.5-flash') {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = genAI.getGenerativeModel({ model });
  }

  async send(prompt: string, history: Message[] = []): Promise<string> {
    const chat = this.model.startChat({
      history: history.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
    });
    const res = await chat.sendMessage(prompt);
    return res.response.text() ?? '';
  }
}
