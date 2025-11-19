/**
 * HTML에서 제목 태그 추출
 * @param {string} html - HTML 문자열
 * @returns {Array} 제목 배열
 */
export function extractHeadings(html) {
  const headings = [];
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h\1>/gi;
  
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const id = match[2];
    const text = match[3].replace(/<[^>]*>/g, ''); // HTML 태그 제거
    
    if (id && id.trim() !== '') {
      headings.push({ level, id, text });
    }
  }
  
  return headings;
}

/**
 * HTML의 제목 태그에 ID 추가
 * @param {string} html - HTML 문자열
 * @returns {string} ID가 추가된 HTML
 */
export function addHeadingIds(html) {
  let idCounter = 0;
  
  return html.replace(/<h([1-6])>(.*?)<\/h\1>/gi, (match, level, content) => {
    // 텍스트에서 ID 생성
    const text = content.replace(/<[^>]*>/g, '');
    let id = text
      .toLowerCase()
      .replace(/[^\w\s가-힣-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    // ID가 비어있으면 카운터 사용
    if (!id) {
      id = `heading-${idCounter++}`;
    } else {
      id = `${id}-${idCounter++}`;
    }
    
    return `<h${level} id="${id}">${content}</h${level}>`;
  });
}

/**
 * 제목 계층 구조 생성
 * @param {Array} headings - 제목 배열
 * @returns {Array} 계층 구조 배열
 */
export function buildHeadingTree(headings) {
  const tree = [];
  const stack = [];

  headings.forEach(heading => {
    const node = { ...heading, children: [] };

    // 스택에서 현재 레벨보다 높거나 같은 레벨 제거
    while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      tree.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  });

  return tree;
}
