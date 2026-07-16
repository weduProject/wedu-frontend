import { useState } from 'react';
import type { Product } from '../shopData';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

// 임시 후기 데이터 (007 백엔드 상품상세 조회 붙으면 교체)
const MOCK_REVIEWS = [
  { id: 1, author: '김**', rating: 5, text: '분위기가 정말 최고였어요. 감동적인 프로포즈 성공!' },
  { id: 2, author: '이**', rating: 4, text: '가격 대비 만족스러웠고 준비 과정도 친절했습니다.' },
];

export default function ProductModal({ product, onClose }: ProductModalProps) {
  // 찜(하트) 상태
  const [liked, setLiked] = useState(false);

  if (!product) return null;

  return (
    // 배경 어둠 + blur (시안: rgba(0,0,0,0.4) + blur 2px)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* 모달 본체 (시안: 흰 배경, radius 16, 그림자, 최대폭 448) */}
      <div
        className="relative flex max-h-[90vh] w-full max-w-[448px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 스크롤 영역 */}
        <div className="overflow-y-auto p-8">
          {/* 헤더: 제목 + 닫기 */}
          <div className="mb-5 flex items-start justify-between">
            <h3 className="text-xl font-bold text-[#0D0B09]">{product.title}</h3>
            <button
              type="button"
              aria-label="닫기"
              onClick={onClose}
              className="text-[#594941] hover:text-[#0D0B09]"
            >
              ✕
            </button>
          </div>

          {/* 상세 이미지 */}
          <div className="mb-5 h-52 w-full overflow-hidden rounded-xl bg-[#F2EEE6]">
            {product.image && (
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          {/* 카테고리 뱃지 + 설명 */}
          <span className="mb-2 inline-block rounded-full bg-[#FAF8F5] px-2.5 py-1 text-xs font-medium text-[#463730]">
            {product.category}
          </span>
          <p className="mb-4 text-sm leading-6 text-[#7C6358]">
            {product.description}
          </p>

          {/* 해시태그 */}
          <div className="mb-5 flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-[#FAF8F5] px-2 py-0.5 text-xs text-[#968178]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* 가격 */}
          <div className="mb-5 border-t border-[#E9E4DA] pt-4">
            <span className="text-sm text-[#594941]">가격</span>
            <p className="text-2xl font-bold text-[#0D0B09]">{product.price}</p>
          </div>

          {/* 후기 */}
          <div className="mb-2 border-t border-[#E9E4DA] pt-4">
            <h4 className="mb-3 text-sm font-semibold text-[#594941]">
              후기 ({MOCK_REVIEWS.length})
            </h4>
            <div className="flex flex-col gap-3">
              {MOCK_REVIEWS.map((review) => (
                <div key={review.id} className="rounded-xl bg-[#FAF8F5] p-3">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-[#594941]">
                      {review.author}
                    </span>
                    <span className="text-xs text-[#FC4A4D]">
                      {'★'.repeat(review.rating)}
                      {'☆'.repeat(5 - review.rating)}
                    </span>
                  </div>
                  <p className="text-sm text-[#7C6358]">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 고정 버튼: 찜 + 장바구니 (시안의 취소/추가 2버튼 레이아웃 차용) */}
        <div className="flex gap-3 border-t border-[#E9E4DA] p-6">
          {/* 찜 버튼 (토글) */}
          <button
            type="button"
            aria-label="찜하기"
            aria-pressed={liked}
            onClick={() => setLiked((prev) => !prev)}
            className="flex h-[46px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#DDD7C9] text-sm font-medium text-[#594941] transition-colors hover:bg-[#FAF8F5]"
          >
            <span className={liked ? 'text-[#FC4A4D]' : 'text-[#594941]'}>
              {liked ? '♥' : '♡'}
            </span>
            찜
          </button>

          {/* 장바구니 버튼 — 상세보기 버튼의 hex(#FC4A4D) 적용 */}
          <button
            type="button"
            className="h-[46px] flex-1 rounded-xl bg-[#FC4A4D] text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            장바구니 담기
          </button>
        </div>
      </div>
    </div>
  );
}