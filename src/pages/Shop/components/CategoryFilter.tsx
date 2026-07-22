import clsx from 'clsx';
import { useState } from 'react';

interface CategoryFilterProps {
  categories: string[];
  styleTags: string[];
  activeCategory: string;
  activeStyle: string;
  onCategoryChange: (category: string) => void;
  onStyleChange: (styleTag: string) => void;
  keyword: string;                       
  onKeywordChange: (keyword: string) => void; 
}

export default function CategoryFilter({
  categories,
  styleTags,
  activeCategory,
  activeStyle,
  onCategoryChange,
  onStyleChange,
  keyword,
  onKeywordChange,
}: CategoryFilterProps) {
  // 입력 중인 값 (버튼/Enter 전까지는 부모에 반영 안 됨)
  const [inputValue, setInputValue] = useState(keyword);

  // 검색 실행 → 부모 keyword에 확정 반영
  const handleSearch = () => {
    onKeywordChange(inputValue.trim());
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                aria-pressed={active}
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-[#FC4A4D] text-white'
                    : 'bg-[#F2EEE6] text-[#5C4940] hover:bg-[#EAE4D8]',
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-[#DDD7C9] bg-white px-4 focus-within:border-[#FC4A4D] transition-colors">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                // 입력창을 비우면 즉시 전체 목록으로 복귀
                if (e.target.value === '') onKeywordChange('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder="상품 검색"
              className="w-48 border-0 bg-transparent py-2.5 text-sm text-[#594941] outline-none placeholder:text-[#9CA3AF]"
              aria-label="상품 검색"
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="rounded-xl border border-[#DDD7C9] bg-white px-5 py-2.5 text-sm font-medium text-[#594941] transition-colors hover:bg-[#FAF8F5]"
          >
            검색
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium text-[#968178]">스타일:</span>
        {styleTags.map((tag) => {
          const active = tag === activeStyle;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onStyleChange(tag)}
              aria-pressed={active}
              className={clsx(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                active
                  ? 'bg-[#0D0A09] text-white'
                  : 'bg-[#F2EEE6] text-[#7C6358] hover:bg-[#EAE4D8]',
              )}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}