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
    <div className="sticky top-16 z-30 border-b border-border bg-white/90 py-4 backdrop-blur-md md:top-20">
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
        {categories.map(({ id, label, Icon }) => {
          const active = id === activeCategory;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onCategoryChange(id)}
              aria-pressed={active}
              className={clsx(
                'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all',
                active ? CATEGORY_TAB_ACTIVE : CATEGORY_TAB_INACTIVE,
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.8} />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}