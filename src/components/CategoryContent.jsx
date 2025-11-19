import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { searchPosts, paginatePosts } from "../utils/markdown-utils";

const ITEMS_PER_PAGE = 10;

export default function CategoryContent({ category, posts, baseUrl }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    return searchPosts(posts, searchQuery);
  }, [posts, searchQuery]);

  const {
    posts: pageItems,
    total,
    pages,
    currentPage: validPage,
  } = useMemo(() => {
    return paginatePosts(filteredPosts, currentPage, ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, pages || 1)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageRange = {
    start: (validPage - 1) * ITEMS_PER_PAGE + 1,
    end: Math.min(validPage * ITEMS_PER_PAGE, total),
  };

  return (
    <div className="space-y-6">
      {/* 검색 바 */}
      <div className="flex justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
          {category.replace(/-/g, ' ')}
        </h1>
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* 결과 정보 */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {searchQuery ? (
          <span>{filteredPosts.length}개 결과 찾음</span>
        ) : (
          <span>총 {total}개의 글</span>
        )}
        {pages > 1 && (
          <span className="ml-2">
            ({pageRange.start}-{pageRange.end} 표시 중)
          </span>
        )}
      </div>

      {/* 글 목록 */}
      {pageItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? "검색 결과가 없습니다." : "글이 없습니다."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {pageItems.map((post) => (
            <Link
              key={post.slug}
              to={`${baseUrl}/${post.category}/${post.slug}`}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {post.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                {post.description}
              </p>
              {post.date && (
                <time className="text-xs text-gray-500 dark:text-gray-500">
                  {new Date(post.date).toLocaleDateString('ko-KR')}
                </time>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => goToPage(validPage - 1)}
            disabled={validPage === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            이전
          </button>

          <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
            {validPage} / {pages}
          </span>

          <button
            onClick={() => goToPage(validPage + 1)}
            disabled={validPage === pages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
