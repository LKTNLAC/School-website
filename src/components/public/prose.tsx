type ProseProps = {
  content: string;
  className?: string;
};

export function Prose({ content, className = '' }: ProseProps) {
  return (
    <div
      className={`prose-custom max-w-3xl whitespace-pre-line text-base leading-relaxed text-neutral-800 ${className}`}
    >
      {content}
    </div>
  );
}