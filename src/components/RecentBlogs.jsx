import { Link } from "react-router-dom";

export default function RecentBlogs({ blogs, limit = 5 }) {
  const displayBlogs = blogs.slice(0, limit);

  if (displayBlogs.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Recent Blogs
        </h2>
        <Link
          to="/blog"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          View All →
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayBlogs.map((blog) => (
          <Link
            key={blog.id}
            to={blog.link}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition block"
          >
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 uppercase">
              {blog.category}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {blog.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
              {blog.description}
            </p>
            {blog.date && (
              <time className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(blog.date).toLocaleDateString('ko-KR')}
              </time>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
