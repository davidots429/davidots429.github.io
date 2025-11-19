import { useState, useEffect } from 'react';
import { loadAllContent } from '../utils/content-loader';

export function useContent() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAllContent()
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load content:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { content, loading, error };
}

// 특정 글 가져오기
export function usePost(type, category, slug) {
  const { content, loading } = useContent();
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (content && content[type] && content[type][category]) {
      const found = content[type][category].find(p => p.slug === slug);
      setPost(found || null);
    }
  }, [content, type, category, slug]);

  return { post, loading };
}

// 카테고리 글 목록
export function useCategoryPosts(type, category) {
  const { content, loading } = useContent();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (content && content[type] && content[type][category]) {
      setPosts(content[type][category]);
    }
  }, [content, type, category]);

  return { posts, loading };
}

// 모든 카테고리
export function useCategories(type) {
  const { content, loading } = useContent();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (content && content[type]) {
      setCategories(Object.keys(content[type]));
    }
  }, [content, type]);

  return { categories, loading };
}
