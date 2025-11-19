import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CategoryContent from "../components/CategoryContent";
import { loadBlogContent } from "../utils/content-loader";

export default function BlogCategory() {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        const blog = await loadBlogContent();
        const categoryPosts = blog?.[category] || [];
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
          to="/blog"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
        >
          ← Back to Blog
        </Link>

        <CategoryContent
          category={category}
          posts={posts}
          baseUrl="/blog"
        />
      </div>
    </div>
  );
}
