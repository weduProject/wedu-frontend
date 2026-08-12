import clsx from 'clsx';


interface CalendarFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CATEGORIES = ['전체', '웨딩홀/예식장', '스튜디오/드레스', '허니문', '예물/예단', '기타'];

export default function CalendarFilter({ activeCategory, onCategoryChange }: CalendarFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {CATEGORIES.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onCategoryChange(tab)}
          className={clsx(
            'shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
            activeCategory === tab ? 'category-tab-active' : 'category-tab-inactive',
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}