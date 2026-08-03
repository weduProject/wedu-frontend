import type { WeddingComingSoonItem } from '../weddingComingSoonData';
import { SUBCATEGORY_CHIP_STYLE } from '../weddingComingSoonData';
import clsx from 'clsx';

interface ComingSoonCardProps {
  item: WeddingComingSoonItem;
}

export default function ComingSoonCard({ item }: ComingSoonCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white">
      <div className="relative flex h-48 w-full items-center justify-center bg-primary-light">
        <span className="rounded-full bg-[#FBBF24] px-4 py-1.5 text-xs font-bold text-[#7C2D12]">
          준비중
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-base font-semibold text-text">{item.title}</h3>
          <span
            className={clsx(
              'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium',
              SUBCATEGORY_CHIP_STYLE[item.subCategory],
            )}
          >
            {item.subCategory}
          </span>
        </div>

        <p className="mb-4 text-sm leading-6 text-[#7C6358]">{item.description}</p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-text-muted">곧 오픈 예정</span>
          <span className="rounded-full bg-[#F0EEED] px-2.5 py-1 text-xs font-medium text-[#6F6765]">
            준비중
          </span>
        </div>
      </div>
    </article>
  );
}