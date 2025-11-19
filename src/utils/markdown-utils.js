/**
 * 게시글 검색 함수
 * @param {Array} posts - 게시글 배열
 * @param {string} query - 검색어
 * @returns {Array} 필터링된 게시글 배열
 */
export function searchPosts(posts, query) {
  if (!query || !query.trim()) {
    return posts;
  }

  const lowerQuery = query.toLowerCase();

  return posts.filter(post => {
    const titleMatch = post.title?.toLowerCase().includes(lowerQuery);
    const descriptionMatch = post.description?.toLowerCase().includes(lowerQuery);
    const tagsMatch = post.tags?.some(tag => 
      tag.toLowerCase().includes(lowerQuery)
    );

    return titleMatch || descriptionMatch || tagsMatch;
  });
}

/**
 * 게시글 페이지네이션 함수
 * @param {Array} posts - 게시글 배열
 * @param {number} currentPage - 현재 페이지 (1부터 시작)
 * @param {number} itemsPerPage - 페이지당 항목 수
 * @returns {Object} 페이지네이션 결과
 */
export function paginatePosts(posts, currentPage, itemsPerPage) {
  const total = posts.length;
  const pages = Math.ceil(total / itemsPerPage);
  
  // 페이지 번호 검증
  const validPage = Math.max(1, Math.min(currentPage, pages || 1));
  
  // 시작 인덱스와 끝 인덱스 계산
  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // 현재 페이지의 항목들
  const pageItems = posts.slice(startIndex, endIndex);

  return {
    posts: pageItems,
    total,
    pages,
    currentPage: validPage,
    hasNext: validPage < pages,
    hasPrev: validPage > 1,
  };
}
