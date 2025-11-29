import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-gray-100 shadow-sm dark:bg-gray-900 border-b border-gray-300 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white">
            davidots429's Blog
          </Link>
          
          <div className="flex gap-6">
            <Link
              to="/about/me"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              About me
            </Link>
            <Link
              to="/about/blog"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              About this site
            </Link>
            <Link
              to="/projects"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Projects
            </Link>
            <Link
              to="/blog"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Articles
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
