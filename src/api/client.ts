import Anthropic from '@anthropic-ai/sdk';
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function* streamMessage(
  messages: MessageParam[],
  systemPrompt: string,
  signal?: AbortSignal
): AsyncGenerator<string> {
  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages,
  });

  for await (const event of stream) {
    if (signal?.aborted) break;
    if (
      event.type === 'content_block_delta' &&
      event.delta.type === 'text_delta'
    ) {
      yield event.delta.text;
    }
  }
}
