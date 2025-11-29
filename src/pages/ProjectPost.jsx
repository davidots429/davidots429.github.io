import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ArticleSidebar from "../components/ArticleSidebar";
import PostNavigation from "../components/PostNavigation";
import RecommendedPosts from "../components/RecommendedPosts";
import { extractHeadings, addHeadingIds } from "../utils/markdown-toc";
import { loadProjectContent } from "../utils/content-loader";

export default function ProjectPost() {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [headings, setHeadings] = useState([]);
  const [prevPost, setPrevPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [recommendedPosts, setRecommendedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleLinkClick = (e) => {
    const link = e.target.closest('a[data-link]');
    if (link) {
      e.preventDefault();
      const url = link.getAttribute('data-link');
      navigate(url);
    }
  };
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const projects = await loadProjectContent();

        // 현재 글 찾기
        const categoryPosts = projects?.[category] || [];
        const currentPost = categoryPosts.find(p => p.slug === slug);

        if (!currentPost) {
          navigate('/projects');
          return;
        }

        // 목차 추출
        const htmlWithIds = addHeadingIds(currentPost.html);
        const extractedHeadings = extractHeadings(htmlWithIds);

        setPost({ ...currentPost, html: htmlWithIds });
        setHeadings(extractedHeadings);

        // 이전/다음 글 찾기 (정렬된 배열 기준)
        const currentIndex = categoryPosts.findIndex(p => p.slug === slug);
        
        // 이전 글: 인덱스가 0보다 크면 존재
        if (currentIndex > 0) {
          setPrevPost(categoryPosts[currentIndex - 1]);
        } else {
          setPrevPost(null);  // 명시적으로 null 설정
        }
        
        // 다음 글: 인덱스가 마지막이 아니면 존재
        if (currentIndex < categoryPosts.length - 1) {
          setNextPost(categoryPosts[currentIndex + 1]);
        } else {
          setNextPost(null);  // 명시적으로 null 설정
        }

        console.log('Current index:', currentIndex);
        console.log('Total posts:', categoryPosts.length);
        console.log('Prev post:', currentIndex > 0 ? categoryPosts[currentIndex - 1]?.title : 'None');
        console.log('Next post:', currentIndex < categoryPosts.length - 1 ? categoryPosts[currentIndex + 1]?.title : 'None');

        // 추천 글 (태그 기반)
        const allPosts = Object.values(projects || {}).flat();
        const recommended = getRecommendedPosts(currentPost, allPosts, 4);
        setRecommendedPosts(recommended);

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch post:', error);
        setLoading(false);
      }
    };

    fetchPost();
  }, [category, slug, navigate]);

  // 추천 글 로직
  const getRecommendedPosts = (currentPost, allPosts, limit) => {
    if (!currentPost.tags || currentPost.tags.length === 0) {
      return allPosts
        .filter(p => p.slug !== currentPost.slug)
        .slice(0, limit);
    }

    const scored = allPosts
      .filter(p => p.slug !== currentPost.slug)
      .map(p => {
        const commonTags = (p.tags || []).filter(tag =>
          currentPost.tags.includes(tag)
        );
        return { post: p, score: commonTags.length };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const dateA = a.post.date ? new Date(a.post.date).getTime() : 0;
        const dateB = b.post.date ? new Date(b.post.date).getTime() : 0;
        return dateB - dateA;
      });

    return scored.slice(0, limit).map(item => item.post);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            프로젝트를 찾을 수 없습니다.
          </p>
          <Link
            to="/projects"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            프로젝트 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          to={`/projects/${category}`}
          className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
        >
          ← 돌아가기
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 사이드바 */}
          <div className="hidden lg:block lg:col-span-1 order-2 lg:order-1">
            <ArticleSidebar headings={headings} />
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <header className="mb-8">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2 capitalize">
                Projects / {category.replace(/-/g, ' ')}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {post.title}
              </h1>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {post.description}
              </p>

              {post.date && (
                <time className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.date).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* 글 내용 */}
            <div className="prose dark:prose-invert max-w-none mb-12" onClick={handleLinkClick}>
              <article
                dangerouslySetInnerHTML={{ __html: post.html }}
                className="markdown-content"
              />
            </div>

            {/* 이전/다음 글 */}
            <PostNavigation
              prevPost={prevPost}
              nextPost={nextPost}
              baseUrl="/projects"
            />

            {/* 추천 글 */}
            <RecommendedPosts posts={recommendedPosts} baseUrl="/projects" />
          </div>
        </div>
      </div>
    </div>
  );
}
