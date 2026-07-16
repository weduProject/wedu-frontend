import type { Product } from '../shopData';

interface ProductModalProps {
  product: Product | null; // null이면 안 열림
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  if (!product) return null; // 열린 상품 없으면 렌더 안 함

  return (
    // 배경 어둠 처리 (클릭하면 닫힘)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      {/* 모달 본체 (안쪽 클릭은 닫힘 방지) */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-[#5C4840] backdrop-blur-sm hover:bg-white"
        >
          ✕
        </button>

        {/* 이미지 */}
        <div className="h-56 w-full bg-[#F2EEE6]">
          {product.image && (
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        {/* 내용 */}
        <div className="p-6">
          <span className="mb-2 inline-block rounded-full bg-[#F2EEE6] px-2.5 py-1 text-xs font-medium text-[#463730]">
            {product.category}
          </span>

          <h2 className="mb-2 text-xl font-bold text-[#0D0A09]">
            {product.title}
          </h2>

          <p className="mb-4 text-sm leading-6 text-[#7C6358]">
            {product.description}
          </p>

          {/* 해시태그 */}
          <div className="mb-5 flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-[#FAF8F4] px-2 py-0.5 text-xs text-[#968178]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 가격 + 액션 */}
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-[#0D0A09]">
              {product.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}