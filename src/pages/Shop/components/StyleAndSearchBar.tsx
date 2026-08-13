import { useState } from 'react';
import clsx from 'clsx';

interface StyleAndSearchBarProps {
  styleTags: string[];
  activeStyle: string;
  onStyleChange: (styleTag: string) => void;
  keyword: string;
  onKeywordChange: (keyword: string) => void;
}

export default function StyleAndSearchBar({
  styleTags,
  activeStyle,
  onStyleChange,
  keyword,
  onKeywordChange,
}: StyleAndSearchBarProps) {
  const [inputValue, setInputValue] = useState(keyword);

  const handleSearch = () => {
    onKeywordChange(inputValue.trim());
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-sm font-medium text-text-muted">스타일:</span>
        {styleTags.map((tag) => {
          const active = tag === activeStyle;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onStyleChange(tag)}
              aria-pressed={active}
              className={clsx(
                'whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                active ? 'bg-text text-white' : 'bg-[#F0EEED] text-[#7C6358] hover:bg-[#E7E4E3]',
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-xl border border-[#DDD7C9] bg-white px-3 transition-colors focus-within:border-primary">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (e.target.value === '') onKeywordChange('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder="상품 검색"
            className="w-36 border-0 bg-transparent py-2 text-sm text-[#594941] outline-none placeholder:text-[#9CA3AF]"
            aria-label="상품 검색"
          />
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="rounded-full border border-[#DDD7C9] bg-white px-4 py-2 text-sm font-medium text-[#594941] transition-colors hover:bg-[#FAF8F5]"
        >
          검색
        </button>
      </div>
    </div>
  );
}