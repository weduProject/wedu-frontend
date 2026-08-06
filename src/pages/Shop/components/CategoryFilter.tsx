import clsx from 'clsx';
import { useState } from 'react';
import { CATEGORY_TAB_ACTIVE, CATEGORY_TAB_INACTIVE } from '../../../styles/categoryTab';

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
  const [inputValue, setInputValue] = useState(keyword);

  const handleSearch = () => {
    onKeywordChange(inputValue.trim());
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                aria-pressed={active}
                className={clsx(
                  'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all',
                  active ? CATEGORY_TAB_ACTIVE : CATEGORY_TAB_INACTIVE,
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-[#DDD7C9] bg-white px-4 focus-within:border-primary transition-colors">
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
              className="w-48 border-0 bg-transparent py-2.5 text-sm text-[#594941] outline-none placeholder:text-[#9CA3AF]"
              aria-label="상품 검색"
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className="rounded-full border border-[#DDD7C9] bg-white px-5 py-2.5 text-sm font-medium text-[#594941] transition-colors hover:bg-[#FAF8F5]"
          >
            검색
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-medium text-text-muted">스타일:</span>
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
                  ? 'bg-text text-white'
                  : 'bg-[#F0EEED] text-[#7C6358] hover:bg-[#E7E4E3]',
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