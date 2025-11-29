import { Link } from "react-router-dom";

export default function PostNavigation({ prevPost, nextPost, baseUrl }) {
  return (
    <nav className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 이전 글 */}
        {prevPost ? (
          <Link
            to={`${baseUrl}/${prevPost.category}/${prevPost.slug}`}
            className="bg-gray-100 shadow-sm dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              ← 이전 글
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
              {prevPost.title}
            </h3>
            {prevPost.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {prevPost.description}
              </p>
            )}
          </Link>
        ) : (
          <div className="bg-gray-100 shadow-sm dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 p-6 opacity-50">
            <div className="text-sm text-gray-500 dark:text-gray-500 mb-2">
              ← 이전 글
            </div>
            <p className="text-gray-400 dark:text-gray-600 italic">
              첫 번째 글입니다
            </p>
          </div>
        )}

        {/* 다음 글 */}
        {nextPost ? (
          <Link
            to={`${baseUrl}/${nextPost.category}/${nextPost.slug}`}
            className="bg-gray-100 shadow-sm dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition"
          >
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 text-right">
              다음 글 →
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-right line-clamp-2">
              {nextPost.title}
            </h3>
            {nextPost.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-right line-clamp-2">
                {nextPost.description}
              </p>
            )}
          </Link>
        ) : (
          <div className="bg-gray-100 shadow-sm dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700 p-6 opacity-50">
            <div className="text-sm text-gray-500 dark:text-gray-500 mb-2 text-right">
              다음 글 →
            </div>
            <p className="text-gray-400 dark:text-gray-600 italic text-right">
              마지막 글입니다
            </p>
          </div>
        )}
      </div>
    </nav>
  );
}
