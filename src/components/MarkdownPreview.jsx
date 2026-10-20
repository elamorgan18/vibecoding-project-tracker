import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Rendered Markdown for the Context preview pane. react-markdown never
 * renders raw HTML and strips unsafe link protocols, so pasted text can't
 * inject markup or scripts. Styling is done with arbitrary-variant classes
 * (no typography plugin).
 */
const PROSE = [
  'text-sm leading-relaxed text-ink break-words',
  '[&>*:first-child]:mt-0 [&>*+*]:mt-3',
  '[&_h1]:text-base [&_h1]:font-semibold [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:tracking-wide [&_h3]:font-semibold',
  '[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li+li]:mt-1',
  '[&_a]:text-brand-hover [&_a]:underline',
  '[&_blockquote]:border-l-4 [&_blockquote]:border-line [&_blockquote]:pl-3 [&_blockquote]:text-ink-soft',
  '[&_code]:rounded [&_code]:bg-muted-bg [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8125rem]',
  '[&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-muted-bg [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0',
  '[&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-line [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_td]:border [&_td]:border-line [&_td]:px-2 [&_td]:py-1',
  '[&_hr]:border-line',
].join(' ');

export default function MarkdownPreview({ markdown }) {
  if (!markdown.trim()) {
    return <p className="text-sm text-muted">Nothing to preview yet.</p>;
  }

  return (
    <div className={PROSE}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
