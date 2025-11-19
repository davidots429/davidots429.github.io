import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadBlogContent } from "../utils/content-loader";

export default function BlogList() {
  const [blogCategories, setBlogCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const blog = await loadBlogContent();

        // 각 카테고리를 10개 제한
        const categories = Object.entries(blog || {}).map(([category, posts]) => ({
          category,
          displayName: category.replace(/-/g, ' '),
          posts: posts.slice(0, 10),
          count: posts.length,
        }));

        setBlogCategories(categories);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch blog content:', error);
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Blog
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          모든 블로그 글을 주제별로 확인하세요
        </p>
      </header>

      {blogCategories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">블로그 글이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {blogCategories.map((topic) => (
            <section key={topic.category} className="border-b border-gray-200 dark:border-gray-700 pb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                  {topic.displayName}
                </h2>
                <Link
                  to={`/blog/${topic.category}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  {topic.posts.length}개 표시 / 전체 {topic.count}개
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topic.posts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.category}/${post.slug}`}
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
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
