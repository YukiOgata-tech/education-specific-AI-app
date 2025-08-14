export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export interface IChatModel {
  /**
   * Sends a prompt to the underlying model.
   * @param prompt New user prompt to send.
   * @param history Optional prior messages in the conversation.
   * @returns Model response as plain text.
   */
  send(prompt: string, history?: Message[]): Promise<string>;
}
