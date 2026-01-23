import { h } from "preact";
import { useMemo } from "preact/hooks";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface MarkdownProps {
  contents: string;
  className?: string;
}

export function Markdown({ contents, className }: MarkdownProps) {
  const htmlContent = useMemo(() => {
    if (!contents) return "";

    const rawHtml = marked.parse(contents, {
      breaks: true,
      gfm: true,
    }) as string;

    return DOMPurify.sanitize(rawHtml);
  }, [contents]);

  return (
    <div
      className={["markdown-component", ...(className ? [className] : [])].join(
        " ",
      )}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
