import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CategoryContent from "../components/CategoryContent";
import { loadProjectContent } from "../utils/content-loader";

export default function ProjectCategory() {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        console.log('Fetching category:', category); // 디버깅

        const projects = await loadProjectContent();
        
        console.log('All projects:', projects); // 디버깅
        console.log('Category posts:', projects?.[category]); // 디버깅

        const categoryPosts = projects?.[category] || [];
        setPosts(categoryPosts);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch category posts:', error);
        setLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          to="/projects"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
        >
          ← Back
        </Link>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              이 카테고리에는 프로젝트가 없습니다.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              카테고리: {category}
            </p>
          </div>
        ) : (
          <CategoryContent
            category={category}
            posts={posts}
            baseUrl="/projects"
          />
        )}
      </div>
    </div>
  );
}
