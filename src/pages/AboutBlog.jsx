import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArticleSidebar from "../components/ArticleSidebar";
import { extractHeadings, addHeadingIds } from "../utils/markdown-toc";
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';

export default function AboutBlog() {
  const [content, setContent] = useState('');
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessReadme = async () => {
      try {
        // README.md 가져오기
        const response = await fetch('/README.md');
        const markdown = await response.text();

        // 마크다운 → HTML 변환
        const processedContent = await remark()
          .use(remarkGfm)
          .use(remarkHtml, { sanitize: false })
          .process(markdown);

        const html = processedContent.toString();

        // 목차 추출
        const htmlWithIds = addHeadingIds(html);
        const extractedHeadings = extractHeadings(htmlWithIds);

        setContent(htmlWithIds);
        setHeadings(extractedHeadings);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load README:', err);
        setLoading(false);
      }
    };

    fetchAndProcessReadme();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
        >
          ← Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 사이드바 */}
          <div className="hidden lg:block lg:col-span-1 order-2 lg:order-1">
            <ArticleSidebar headings={headings} />
          </div>

          {/* 마크다운 콘텐츠 */}
          <div className="lg:col-span-3 order-1 lg:order-1">
            <div className="prose dark:prose-invert max-w-none">
              <article
                dangerouslySetInnerHTML={{ __html: content }}
                className="markdown-content"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
