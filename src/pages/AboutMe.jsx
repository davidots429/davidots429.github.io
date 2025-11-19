import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArticleSidebar from "../components/ArticleSidebar";
import { extractHeadings, addHeadingIds } from "../utils/markdown-toc";
import { loadAboutContent } from "../utils/content-loader";

export default function AboutMe() {
  const [content, setContent] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const aboutMe = await loadAboutContent();

        if (aboutMe) {
          const htmlWithIds = addHeadingIds(aboutMe.html);
          const extractedHeadings = extractHeadings(htmlWithIds);

          setContent({ ...aboutMe, html: htmlWithIds });
          setHeadings(extractedHeadings);
        }

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch about content:', error);
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Content not found</p>
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
          ← Back Home
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 사이드바 */}
          <div className="hidden lg:block lg:col-span-1 order-2 lg:order-1">
            <ArticleSidebar headings={headings} />
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* 콘텐츠 */}
            <div className="prose dark:prose-invert max-w-none mb-8">
              <article
                dangerouslySetInnerHTML={{ __html: content.html }}
                className="markdown-content"
              />
            </div>

            {/* PDF 링크 섹션 */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                📄 문서
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                {/* 이력서 */}
                <Link
                  to="/document/resume"
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 3a2 2 0 012-2h6a1 1 0 01.894.553l2 4H4V3zm0 5h12v2H4V8zm0 3h12v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      이력서
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    저의 이력서입니다.
                  </p>
                </Link>

                {/* 자기소개서 */}
                <Link
                  to="/document/introduction"
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M4 3a2 2 0 012-2h6a1 1 0 01.894.553l2 4H4V3zm0 5h12v2H4V8zm0 3h12v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5z" />
                    </svg>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      자기소개서
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    저의 자기소개서입니다.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
