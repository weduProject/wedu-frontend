import type { Product } from '../shopData';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-[#EAE4D8] bg-white">
      {/* 이미지 영역 */}
      <div className="relative h-48 w-full bg-[#F2EEE6]">
        {product.image && (
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        )}

        {/* 카테고리 뱃지 (좌상단) */}
        <span className="absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-[#463730] backdrop-blur-sm">
          {product.category}
        </span>

        {/* 좋아요 버튼 (우상단) */}
        <button
          type="button"
          aria-label="좋아요"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
        >
          <span className="text-sm text-[#5C4840]">♡</span>
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 text-base font-semibold text-[#0D0A09]">
          {product.title}
        </h3>

        <p className="mb-3 text-sm leading-6 text-[#7C6358]">
          {product.description}
        </p>

        {/* 해시태그 */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-[#FAF8F4] px-2 py-0.5 text-xs text-[#968178]"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* 가격 + 상세보기 (하단 고정) */}
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-bold text-[#0D0A09]">
            {product.price}
          </span>
          <button
            type="button"
            className="rounded-full bg-[#FC4A4D] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            상세보기
          </button>
        </div>
      </div>
    </article>
  );
}