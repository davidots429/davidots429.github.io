import { visit } from 'unist-util-visit';

/**
 * remark 플러그인: 링크를 React Router 호환 형식으로 변환
 * 상대 경로 링크는 data-link 속성으로, 외부 링크는 target="_blank" 추가
 */
export function remarkLinkPlugin() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      const url = node.url;
      
      // 외부 링크
      if (url?.startsWith('http') || url?.startsWith('mailto:')) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.target = '_blank';
        node.data.hProperties.rel = 'noopener noreferrer';
      }
      // 상대 경로 (내부 링크)
      else if (url && !url.startsWith('#')) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties['data-link'] = url; // data-link 속성으로 표시
      }
      // 앵커 링크 (#section-id)는 그대로 두기
    });
  };
}
