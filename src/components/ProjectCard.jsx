import { Link } from 'react-router-dom';

export default function ProjectCard({ id, title, description, link, tags }) {
  return (
    <article className="bg-gray-100 shadow-sm dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 p-6 hover:shadow-lg hover:scale-105 transition">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
        {description}
      </p>
      
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map(tag => (
            <span 
              key={tag}
              className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <Link 
        href={link}
        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
      >
        자세히 보기 →
      </Link>
    </article>
  );
}
