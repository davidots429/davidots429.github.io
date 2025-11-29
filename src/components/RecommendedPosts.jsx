import { Link } from "react-router-dom";

export default function RecommendedPosts({ posts, baseUrl }) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-gray-200 dark:border-gray-700 pt-12 mt-12">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        추천 글
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`${baseUrl}/${post.category}/${post.slug}`}
            className="bg-gray-100 shadow-sm dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-400 transition"
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {post.title}
            </h3>
            {post.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {post.description}
              </p>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map(tag => (
                  <span
                    key={tag}
                    className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}