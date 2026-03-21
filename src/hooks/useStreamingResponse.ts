import { useCallback, useRef, useState } from 'react';
import { streamMessage } from '../api/client';
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';

type StreamState = 'idle' | 'streaming' | 'done' | 'error';

interface UseStreamingResponseOptions {
  onChunk: (chunk: string) => void;
  onDone: () => void;
  onError?: (err: unknown) => void;
}

export function useStreamingResponse(options: UseStreamingResponseOptions) {
  const [state, setState] = useState<StreamState>('idle');
  const abortRef = useRef<AbortController | null>(null);

  const send = useCallback(
    async (messages: MessageParam[], systemPrompt: string) => {
      abortRef.current = new AbortController();
      setState('streaming');

      try {
        for await (const chunk of streamMessage(
          messages,
          systemPrompt,
          abortRef.current.signal
        )) {
          options.onChunk(chunk);
        }
        options.onDone();
        setState('done');
      } catch (err) {
        options.onError?.(err);
        setState('error');
      }
    },
    []
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { state, send, abort };
}
