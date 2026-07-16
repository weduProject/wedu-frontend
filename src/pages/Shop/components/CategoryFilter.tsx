import clsx from 'clsx';

interface CategoryFilterProps {
  categories: string[];
  styleTags: string[];
  activeCategory: string;
  activeStyle: string;
  onCategoryChange: (category: string) => void;
  onStyleChange: (styleTag: string) => void;
}

export default function CategoryFilter({
  categories,
  styleTags,
  activeCategory,
  activeStyle,
  onCategoryChange,
  onStyleChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* 1줄: 카테고리 (전체/장소/서비스/경험/선물) */}
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

      {/* 2줄: 스타일 태그 */} 
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