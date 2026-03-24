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
  try {
    const stream = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      // Pass system as a cached block so the large curriculum prompt is only
      // billed at full price once per 5-minute window, then cached (~10x cheaper).
      system: [
        {
          type: 'text',
          text: systemPrompt,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages,
      stream: true,
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
  } catch (err) {
    console.error('Anthropic API error:', err);
    throw err;
  }
}
