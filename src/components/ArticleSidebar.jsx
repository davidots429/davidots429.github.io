import { useState, useEffect } from "react";

export default function ArticleSidebar({ headings }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeHeading, setActiveHeading] = useState("");
  const [validHeadings, setValidHeadings] = useState([]);
  const [searchMatches, setSearchMatches] = useState([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(-1);

  useEffect(() => {
    const valid = headings.filter((h) => h.id && h.id.trim() !== "");
    setValidHeadings(valid);
  }, [headings]);

  const goToNextResult = () => {
    if (searchMatches.length === 0) return;

    let nextIndex = currentResultIndex + 1;
    if (nextIndex >= searchMatches.length) {
      nextIndex = 0;
    }

    scrollToResult(nextIndex);
  };

  const goToPrevResult = () => {
    if (searchMatches.length === 0) return;

    let prevIndex = currentResultIndex - 1;
    if (prevIndex < 0) {
      prevIndex = searchMatches.length - 1;
    }

    scrollToResult(prevIndex);
  };

  const scrollToResult = (index) => {
    if (
      searchMatches.length === 0 ||
      index < 0 ||
      index >= searchMatches.length
    ) {
      return;
    }

    const element = searchMatches[index];

    searchMatches.forEach((match, idx) => {
      if (idx === index) {
        match.classList.add("bg-orange-300", "dark:bg-orange-600");
        match.classList.remove("bg-yellow-200", "dark:bg-yellow-700");
      } else {
        match.classList.add("bg-yellow-200", "dark:bg-yellow-700");
        match.classList.remove("bg-orange-300", "dark:bg-orange-600");
      }
    });

    setCurrentResultIndex(index);

    setTimeout(() => {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (!query.trim()) {
      const marks = document.querySelectorAll("mark");
      marks.forEach((mark) => {
        const parent = mark.parentNode;
        if (parent) {
          parent.replaceChild(
            document.createTextNode(mark.textContent || ""),
            mark
          );
          parent.normalize();
        }
      });
      setSearchMatches([]);
      setCurrentResultIndex(-1);
      return;
    }

    highlightText(query);
  };

  const highlightText = (query) => {
    const existingMarks = document.querySelectorAll("mark");
    existingMarks.forEach((mark) => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(
          document.createTextNode(mark.textContent || ""),
          mark
        );
        parent.normalize();
      }
    });

    const articleContent = document.querySelector(".markdown-content");
    if (!articleContent) return;

    const treeWalker = document.createTreeWalker(
      articleContent,
      NodeFilter.SHOW_TEXT,
      null
    );

    const nodesToReplace = [];
    let node;

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedQuery, "gi");

    while ((node = treeWalker.nextNode())) {
      const text = node.textContent || "";
      const matches = text.match(regex);

      if (matches) {
        const parent = node.parentNode;
        if (parent) {
          nodesToReplace.push({ node, parent });
        }
      }
    }

    nodesToReplace.forEach(({ node, parent }) => {
      const span = document.createElement("span");
      const text = node.textContent || "";
      span.innerHTML = text.replace(
        new RegExp(escapedQuery, "gi"),
        `<mark class="bg-yellow-200 dark:bg-yellow-700">$&</mark>`
      );
      parent.replaceChild(span, node);
    });

    const allMarks = Array.from(
      document.querySelectorAll("mark")
    );
    setSearchMatches(allMarks);
    setCurrentResultIndex(-1);

    if (allMarks.length > 0) {
      scrollToResult(0);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      let closest = null;
      let closestDistance = Infinity;

      for (const heading of validHeadings) {
        if (!heading.id || heading.id.trim() === "") {
          continue;
        }

        const element = document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          const distance = Math.abs(rect.top - 200);

          if (rect.top < 400 && distance < closestDistance) {
            closest = heading;
            closestDistance = distance;
          }
        }
      }

      if (closest !== null) {
        setActiveHeading(closest.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [validHeadings]);

  const scrollToHeading = (id) => {
    if (!id || id.trim() === "") {
      console.warn("Invalid heading ID:", id);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveHeading(id);
    } else {
      console.warn("Element not found for ID:", id);
    }
  };

  const getIndent = (level) => {
    const indents = {
      1: "pl-0",
      2: "pl-3",
      3: "pl-6",
      4: "pl-9",
      5: "pl-12",
      6: "pl-15",
    };
    return indents[level] || "pl-0";
  };

  return (
    <aside className="w-64 bg-gray-100 shadow-sm dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700 h-fit sticky top-24 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <div className="mb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="글에서 검색..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-3 py-2 pr-10 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
            />
            <svg
              className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {searchMatches.length > 0 && (
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {currentResultIndex + 1} / {searchMatches.length}
            </div>

            <div className="flex gap-1">
              <button
                onClick={goToPrevResult}
                className="flex-1 px-2 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-xs font-bold transition"
                title="이전 결과 (▲)"
                aria-label="이전 검색 결과"
              >
                ↑
              </button>

              <button
                onClick={goToNextResult}
                className="flex-1 px-2 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-xs font-bold transition"
                title="다음 결과 (▼)"
                aria-label="다음 검색 결과"
              >
                ↓
              </button>
            </div>
          </div>
        )}

        {searchQuery && searchMatches.length === 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            일치하는 결과 없음
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-4 min-h-0">
        <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
          목차
        </div>

        {validHeadings.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            제목이 없습니다.
          </p>
        ) : (
          <ul className="space-y-1">
            {validHeadings.map((heading, index) => (
              <li key={`${heading.id}-${index}`}>
                <button
                  onClick={() => scrollToHeading(heading.id)}
                  className={`
                    w-full text-left px-2 py-1 rounded text-sm transition truncate
                    ${getIndent(heading.level)}
                    ${
                      activeHeading === heading.id
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                  `}
                  title={heading.text}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
}
