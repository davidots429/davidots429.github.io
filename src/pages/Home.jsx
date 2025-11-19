import { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import RecentProjects from "../components/RecentProjects";
import RecentBlogs from "../components/RecentBlogs";
import { loadAllContent } from "../utils/content-loader";

export default function Home() {
  const [recentProjects, setRecentProjects] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await loadAllContent();

        // 프로젝트: 모든 카테고리 합치기
        const allProjects = Object.values(data.projects || {}).flat();
        const sortedProjects = allProjects.sort((a, b) => {
          if (a.date && b.date) {
            return new Date(b.date) - new Date(a.date);
          }
          return 0;
        });

        setRecentProjects(
          sortedProjects.slice(0, 5).map((project) => ({
            id: `${project.category}/${project.slug}`,
            title: project.title,
            description: project.description,
            link: `/projects/${project.category}/${project.slug}`,
            tags: project.tags || [],
          }))
        );

        // 블로그: 모든 카테고리 합치기
        const allBlogs = Object.values(data.blog || {}).flat();
        const sortedBlogs = allBlogs.sort((a, b) => {
          if (a.date && b.date) {
            return new Date(b.date) - new Date(a.date);
          }
          return 0;
        });

        setRecentBlogs(
          sortedBlogs.slice(0, 5).map((blog) => ({
            id: `${blog.category}/${blog.slug}`,
            title: blog.title,
            description: blog.description,
            date: blog.date || new Date().toISOString(),
            slug: blog.slug || "",
            link: `/blog/${blog.category}/${blog.slug}`,
            category: blog.category,
          }))
        );

        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch content:', error);
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
    <div className="min-h-screen">
      <HeroSection
        imagePath="/images/profile.jpg"
        title="Hello, World!"
        description="개발자로서 새로운 기술을 배우고 프로젝트를 진행하고 있습니다. 이곳에서는 제 개발 경험과 학습 과정을 공유합니다."
      />
      <RecentProjects projects={recentProjects} limit={5} />
      <RecentBlogs blogs={recentBlogs} limit={5} />
    </div>
  );
}
