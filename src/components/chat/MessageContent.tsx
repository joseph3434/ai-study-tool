import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface MessageContentProps {
  content: string;
}

export function MessageContent({ content }: MessageContentProps) {
  return (
    <div className="prose prose-sm max-w-none break-words">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeHighlight]}
        components={{
          // Override pre to add styling
          pre: ({ children, ...props }) => (
            <pre
              {...props}
              className="rounded-xl p-4 overflow-x-auto text-sm"
              style={{ background: 'var(--color-surface-3)' }}
            >
              {children}
            </pre>
          ),
          // Override code for inline code
          code: ({ children, className, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  {...props}
                  className="rounded px-1.5 py-0.5 text-sm font-mono"
                  style={{
                    background: 'var(--color-surface-3)',
                    color: 'var(--color-brand-300)',
                  }}
                >
                  {children}
                </code>
              );
            }
            return <code className={className} {...props}>{children}</code>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
