import { useState, useRef } from 'react';
import ShopHero from './components/ShopHero';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import ComingSoonCard from './components/ComingSoonCard';
import TasteFinder from './components/TasteFinder';
import ShopCTA from './components/ShopCTA';
import { PRODUCTS } from './shopData';
import { WEDDING_COMING_SOON } from './weddingComingSoonData';

const CATEGORIES = ['전체', '장소', '서비스', '경험', '선물', '웨딩'];
const STYLE_TAGS = ['전체 스타일', '로맨틱', '우아한', '모험적', '아늑한', '깜짝', '감성적'];
const WEDDING_SUBCATEGORIES = ['전체', '웨딩홀', '스튜디오', '드레스', '메이크업', '허니문', '웨딩카', '플래너'];

// 부드러운 스크롤 (duration 밀리초 동안, ease-in-out 곡선으로 이동)
function smoothScrollTo(target: HTMLElement | null, duration: number) {
  if (!target) return;

  const startY = window.scrollY;
  const targetY =
    target.getBoundingClientRect().top + window.scrollY - 40; // 위 여백 
  const distance = targetY - startY;
  let startTime: number | null = null;

  // ease-in-out 곡선 (천천히 시작 → 빨라짐 → 천천히 끝)
  const easeInOutQuad = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  function step(currentTime: number) {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    window.scrollTo(0, startY + distance * easeInOutQuad(progress));

    if (elapsed < duration) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

export default function ShopPage() {
  const [filters, setFilters] = useState({
    category: '전체',
    styleTag: '전체 스타일',
    weddingSubCategory: '전체',
  });

  // 취향 다중 선택 상태 (TasteFinder에서 끌어올림)
  const [selectedTastes, setSelectedTastes] = useState<string[]>([]);

  // 상품 그리드 위치 참조 (취향 선택 시 여기로 스크롤)
  const gridRef = useRef<HTMLDivElement>(null);

  // 검색어 (편집샵 내부 검색창)
  const [keyword, setKeyword] = useState('');

  const isWedding = filters.category === '웨딩';

  // 취향 토글 (다중 선택)
  const toggleTaste = (label: string) => {
    setSelectedTastes((prev) =>
      prev.includes(label)
        ? prev.filter((l) => l !== label)
        : [...prev, label],
    );

    // 웨딩 탭에서 취향 선택 시 프로포즈 편집실 '전체' 탭으로 전환
    if (isWedding) {
      setFilters((prev) => ({ ...prev, category: '전체' }));
    }

    // 상품 그리드로 부드럽게 스크롤 (속도 직접 제어)
    smoothScrollTo(gridRef.current, 800); // 800ms 동안 이동
  };

  // 클라이언트 사이드 필터링 (임시)
  // TODO: 백엔드 검색/필터 API 나오면 API 호출로 교체
  const products = PRODUCTS.filter((product) => {
    const categoryMatch =
      filters.category === '전체' || product.categoryType === filters.category;

    const styleMatch =
      filters.styleTag === '전체 스타일' ||
      product.styles.includes(filters.styleTag);

    const tasteMatch =
      selectedTastes.length === 0 ||
      selectedTastes.some((t) => product.tastes.includes(t));
    
    const keywordMatch =
      keyword === '' ||
      product.title.toLowerCase().includes(keyword.toLowerCase()) ||
      product.description.toLowerCase().includes(keyword.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(keyword.toLowerCase()),
    );

    return categoryMatch && styleMatch && tasteMatch && keywordMatch;
  });

  // 웨딩 카테고리 하위 필터링 (준비중 mock 데이터)
  const weddingItems = WEDDING_COMING_SOON.filter(
    (item) =>
      filters.weddingSubCategory === '전체' ||
      item.subCategory === filters.weddingSubCategory,
  );

  return (
    <div className="relative mx-auto max-w-5xl">
      {/* 피그마 원본의 페이지 전체 배경 텍스처 (opacity 3%, 장식용) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-6 -top-8 -z-10 h-full w-[calc(100%+3rem)] opacity-[0.03]"
        style={{
          background:
            'radial-gradient(70.71% 113.14% at 50% 80%, rgba(197,136,176,0.15) 0%, rgba(0,0,0,0) 50%), radial-gradient(113.14% 113.14% at 80% 20%, rgba(198,147,86,0.2) 0%, rgba(0,0,0,0) 50%), radial-gradient(113.14% 70.71% at 20% 50%, rgba(232,121,108,0.3) 0%, rgba(0,0,0,0) 50%)',
        }}
      />

      <ShopHero />

      <div className="mt-8">
        <CategoryFilter
          categories={CATEGORIES}
          styleTags={STYLE_TAGS}
          weddingSubCategories={WEDDING_SUBCATEGORIES}
          activeCategory={filters.category}
          activeStyle={filters.styleTag}
          activeWeddingSubCategory={filters.weddingSubCategory}
          onCategoryChange={(category) =>
            setFilters((prev) => ({ ...prev, category }))
          }
          onStyleChange={(styleTag) =>
            setFilters((prev) => ({ ...prev, styleTag }))
          }
          onWeddingSubCategoryChange={(weddingSubCategory) =>
            setFilters((prev) => ({ ...prev, weddingSubCategory }))
          }
          keyword={keyword}
          onKeywordChange={setKeyword}
        />
      </div>

      {/* 취향 선택 시 상품 목록으로 스크롤 */}
      <div ref={gridRef} className="scroll-mt-6">
        {isWedding ? (
          <>
            <p className="mt-6 text-sm text-[#968178]">총 {weddingItems.length}개</p>

            <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {weddingItems.map((item) => (
                <ComingSoonCard key={item.id} item={item} />
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center rounded-2xl border border-[#FBEFC0] bg-[#FEF9E7] px-8 py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FDECC8] text-xl">
                🛠️
              </div>
              <h3 className="mb-2 text-lg font-bold text-text">웨딩 서비스 준비 중입니다</h3>
              <p className="text-sm leading-6 text-[#8D8060]">
                현재 웨딩홀, 스튜디오, 드레스, 메이크업 등 웨딩 관련 서비스 업체들을 엄선
                <br />
                하여 준비하고 있어요. 곧 더 많은 선택지로 찾아뵙겠습니다!
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="mt-6 text-sm text-[#968178]">총 {products.length}개</p>

            <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {products.length === 0 && (
              <p className="mt-10 text-center text-sm text-[#968178]">
                조건에 맞는 상품이 없어요.
              </p>
            )}
          </>
        )}
      </div>

      <div className="mt-8">
        <TasteFinder selected={selectedTastes} onToggle={toggleTaste} />
      </div>

      <div className="mt-8">
        <ShopCTA />
      </div>

    </div>
  );
}