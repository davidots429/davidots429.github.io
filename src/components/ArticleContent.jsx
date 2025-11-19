export default function ArticleContent({ html }) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <article
        className="markdown-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}