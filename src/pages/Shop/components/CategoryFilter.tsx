import clsx from 'clsx';
import { useState } from 'react';

interface CategoryFilterProps {
  categories: string[];
  styleTags: string[];
  weddingSubCategories: string[];
  activeCategory: string;
  activeStyle: string;
  activeWeddingSubCategory: string;
  onCategoryChange: (category: string) => void;
  onStyleChange: (styleTag: string) => void;
  onWeddingSubCategoryChange: (subCategory: string) => void;
  keyword: string;
  onKeywordChange: (keyword: string) => void;
}

export default function CategoryFilter({
  categories,
  styleTags,
  weddingSubCategories,
  activeCategory,
  activeStyle,
  activeWeddingSubCategory,
  onCategoryChange,
  onStyleChange,
  onWeddingSubCategoryChange,
  keyword,
  onKeywordChange,
}: CategoryFilterProps) {
  const [inputValue, setInputValue] = useState(keyword);
  const isWedding = activeCategory === '웨딩';

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
                  'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-white'
                    : 'bg-primary-light text-[#5C4940] hover:bg-border',
                )}
              >
                {cat}
                {cat === '웨딩' && (
                  <span className="rounded-full bg-[#FEF3C7] px-1.5 py-0.5 text-[10px] font-bold leading-none text-[#B45309]">
                    준비중
                  </span>
                )}
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
            className="rounded-xl border border-[#DDD7C9] bg-white px-5 py-2.5 text-sm font-medium text-[#594941] transition-colors hover:bg-[#FAF8F5]"
          >
            검색
          </button>
        </div>
      </div>

      {isWedding ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-xs font-medium text-text-muted">카테고리:</span>
          {weddingSubCategories.map((sub) => {
            const active = sub === activeWeddingSubCategory;
            return (
              <button
                key={sub}
                type="button"
                onClick={() => onWeddingSubCategoryChange(sub)}
                aria-pressed={active}
                className={clsx(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  active
                    ? 'bg-text text-white'
                    : 'bg-primary-light text-[#7C6358] hover:bg-border',
                )}
              >
                {sub}
              </button>
            );
          })}
        </div>
      ) : (
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
                    : 'bg-primary-light text-[#7C6358] hover:bg-border',
                )}
              >
                {tag}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}