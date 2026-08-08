import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';
import { CATEGORY_TAB_ACTIVE, CATEGORY_TAB_INACTIVE } from '../../../styles/categoryTab';

interface CategoryOption {
  id: string;
  label: string;
  Icon: LucideIcon;
}

interface CategoryFilterProps {
  categories: readonly CategoryOption[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="sticky top-16 z-30 border-b border-[#E7E4E3]/60 bg-[#FAF8F8]/80 backdrop-blur-[12px] md:top-20">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="flex items-center gap-1.5 py-4">
          {categories.map(({ id, label, Icon }) => {
            const active = id === activeCategory;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onCategoryChange(id)}
                aria-pressed={active}
                className={clsx(
                  'flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-all',
                  active ? CATEGORY_TAB_ACTIVE : CATEGORY_TAB_INACTIVE,
                )}
              >
                <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}