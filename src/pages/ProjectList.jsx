import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { loadProjectContent } from "../utils/content-loader";

export default function ProjectList() {
  const [projectCategories, setProjectCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const projects = await loadProjectContent();

        console.log('Loaded projects:', projects); // 디버깅

        const categories = Object.entries(projects || {}).map(([category, posts]) => ({
          category,
          displayName: category.replace(/-/g, ' '),
          posts: posts.slice(0, 10),
          count: posts.length,
        }));

        console.log('Formatted categories:', categories); // 디버깅

        setProjectCategories(categories);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch project content:', error);
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
          Projects
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          모든 프로젝트를 카테고리별로 확인하세요
        </p>
      </header>

      {projectCategories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">프로젝트가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {projectCategories.map((category) => (
            <section key={category.category} className="border-b border-gray-200 dark:border-gray-700 pb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                  {category.displayName}
                </h2>
                <Link
                  to={`/projects/${category.category}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  {category.posts.length}개 표시 / 전체 {category.count}개
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.posts.map((post) => (
                  <Link
                    key={post.slug}
                    to={`/projects/${post.category}/${post.slug}`}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition"
                  >
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                      {post.description}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
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
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
