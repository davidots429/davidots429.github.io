import { Link } from 'react-router-dom';

export default function BlogCard({ id, title, description, date, slug, category }) {
  return (
    <article className="bg-gray-100 shadow-sm dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3 gap-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
          {title}
        </h3>
        <time className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
          {new Date(date).toLocaleDateString('ko-KR')}
        </time>
      </div>
      
      {category && (
        <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
          #{category}
        </p>
      )}
      
      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
        {description}
      </p>
      
      <Link 
        href={`/blog/${slug}`}
        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
      >
        읽기 →
      </Link>
    </article>
  );
}
