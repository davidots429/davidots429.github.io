import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import matter from 'gray-matter';

// Vite의 import.meta.glob으로 마크다운 파일 가져오기
const blogFiles = import.meta.glob('/content/blog/**/*.md', { 
  eager: true,
  query: '?raw',
  import: 'default'
});

const projectFiles = import.meta.glob('/content/projects/**/*.md', { 
  eager: true,
  query: '?raw',
  import: 'default'
});

const aboutFiles = import.meta.glob('/content/about/*.md', { 
  eager: true,
  query: '?raw',
  import: 'default'
});

// 마크다운 → HTML 변환
async function processMarkdown(content) {
  const { data, content: markdown } = matter(content);
  
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);

  return {
    meta: data,
    html: processedContent.toString(),
  };
}

// ✅ 수정된 경로 파싱 함수
function parseBlogPath(path) {
  // /content/blog/theme1/sample.md
  const match = path.match(/\/content\/blog\/([^/]+)\/([^/]+)\.md$/);
  if (match) {
    return {
      category: match[1],  // theme1
      slug: match[2],      // sample
    };
  }
  return null;
}

function parseProjectPath(path) {
  // /content/projects/blog/overview.md
  const match = path.match(/\/content\/projects\/([^/]+)\/([^/]+)\.md$/);
  if (match) {
    return {
      category: match[1],  // blog
      slug: match[2],      // overview
    };
  }
  return null;
}

// 블로그 콘텐츠 로드
export async function loadBlogContent() {
  const blog = {};

  for (const [path, content] of Object.entries(blogFiles)) {
    const parsed = parseBlogPath(path);
    if (!parsed) {
      console.warn('Failed to parse blog path:', path);
      continue;
    }

    const { category, slug } = parsed;
    
    if (!blog[category]) {
      blog[category] = [];
    }

    const processed = await processMarkdown(content);
    blog[category].push({
      slug,
      category,
      ...processed.meta,
      html: processed.html,
    });
  }

  // 날짜순 정렬
  Object.keys(blog).forEach(category => {
    blog[category].sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });
  });

  return blog;
}

// 프로젝트 콘텐츠 로드
export async function loadProjectContent() {
  const projects = {};

  for (const [path, content] of Object.entries(projectFiles)) {
    const parsed = parseProjectPath(path);
    if (!parsed) {
      console.warn('Failed to parse project path:', path);
      continue;
    }

    const { category, slug } = parsed;
    
    if (!projects[category]) {
      projects[category] = [];
    }

    const processed = await processMarkdown(content);
    projects[category].push({
      slug,
      category,
      ...processed.meta,
      html: processed.html,
    });
  }

  // order 또는 날짜순 정렬
  Object.keys(projects).forEach(category => {
    projects[category].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date);
      }
      return 0;
    });
  });

  return projects;
}

// About 콘텐츠 로드
export async function loadAboutContent() {
  const aboutMe = aboutFiles['/content/about/me.md'];
  
  if (aboutMe) {
    return await processMarkdown(aboutMe);
  }
  
  return null;
}

// 모든 콘텐츠 한번에 로드
export async function loadAllContent() {
  const [blog, projects, aboutMe] = await Promise.all([
    loadBlogContent(),
    loadProjectContent(),
    loadAboutContent(),
  ]);

  return { blog, projects, aboutMe };
}
