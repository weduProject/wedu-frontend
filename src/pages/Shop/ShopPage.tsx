import { useState, useRef } from 'react';
import { LayoutGrid, UtensilsCrossed, Building2, Sun, Flower2, Camera, Music, Flame, Gem } from 'lucide-react';
import ShopHero from './components/ShopHero';
import CategoryFilter from './components/CategoryFilter';
import StyleAndSearchBar from './components/StyleAndSearchBar';
import ProductCard from './components/ProductCard';
import TasteFinder from './components/TasteFinder';
import ShopCTA from './components/ShopCTA';
import { PRODUCTS } from './shopData';

const CATEGORIES = [
  { id: '전체', label: '전체', Icon: LayoutGrid },
  { id: '🍽️ 장소', label: '프라이빗다이닝', Icon: UtensilsCrossed },
  { id: '🏨 장소', label: '5성급호텔', Icon: Building2 },
  { id: '🌅 장소', label: '제주', Icon: Sun },
  { id: '💐 서비스', label: '플라워데코', Icon: Flower2 },
  { id: '📸 서비스', label: '스냅', Icon: Camera },
  { id: '🎻 경험', label: '라이브연주', Icon: Music },
  { id: '🎆 경험', label: '이벤트', Icon: Flame },
  { id: '💍 선물', label: '주얼리', Icon: Gem },
] as const;

const STYLE_TAGS = ['전체 스타일', '로맨틱', '우아한', '럭셔리', '감성적', '모던', '아늑한', '깜짝', '모험적'];

function smoothScrollTo(target: HTMLElement | null, duration: number) {
  if (!target) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    target.scrollIntoView({ behavior: 'auto', block: 'start' });
    return;
  }

  const startY = window.scrollY;
  const targetY = target.getBoundingClientRect().top + window.scrollY - 40;
  const distance = targetY - startY;
  let startTime: number | null = null;

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
  });

  const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const [keyword, setKeyword] = useState('');

  const toggleTaste = (label: string) => {
    setSelectedTastes((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
    smoothScrollTo(gridRef.current, 800);
  };

  // TODO: 백엔드 검색/필터 API 나오면 API 호출로 교체
  const products = PRODUCTS.filter((product) => {
    const categoryMatch = filters.category === '전체' || product.category === filters.category;
    const styleMatch =
      filters.styleTag === '전체 스타일' || product.styles.includes(filters.styleTag);
    const tasteMatch =
      selectedTastes.length === 0 || selectedTastes.some((t) => product.tastes.includes(t));
    const keywordMatch =
      keyword === '' ||
      product.title.toLowerCase().includes(keyword.toLowerCase()) ||
      product.description.toLowerCase().includes(keyword.toLowerCase()) ||
      product.tags.some((tag) => tag.toLowerCase().includes(keyword.toLowerCase()));

    return categoryMatch && styleMatch && tasteMatch && keywordMatch;
  });

  return (
    <div className="relative mx-auto max-w-5xl">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-6 -top-8 -z-10 h-full w-[calc(100%+3rem)] opacity-[0.03]"
        style={{
          background:
            'radial-gradient(70.71% 113.14% at 50% 80%, rgba(197,136,176,0.15) 0%, rgba(0,0,0,0) 50%), radial-gradient(113.14% 113.14% at 80% 20%, rgba(198,147,86,0.2) 0%, rgba(0,0,0,0) 50%), radial-gradient(113.14% 70.71% at 20% 50%, rgba(232,121,108,0.3) 0%, rgba(0,0,0,0) 50%)',
        }}
      />

      <ShopHero />

      {/* 카테고리(sticky) ~ 상품 그리드를 한 부모(relative) 안에 묶어서, sticky가 이 영역 끝까지 따라오게 함 */}
      <div className="relative mt-2">
        <CategoryFilter
          categories={CATEGORIES}
          activeCategory={filters.category}
          onCategoryChange={(category) => setFilters((prev) => ({ ...prev, category }))}
        />

        <StyleAndSearchBar
          styleTags={STYLE_TAGS}
          activeStyle={filters.styleTag}
          onStyleChange={(styleTag) => setFilters((prev) => ({ ...prev, styleTag }))}
          keyword={keyword}
          onKeywordChange={setKeyword}
        />

        <div ref={gridRef} className="scroll-mt-6">
          <p className="mt-6 text-sm text-[#968178]">총 {products.length}개</p>
          <div className="mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {products.length === 0 && (
            <p className="mt-10 text-center text-sm text-[#968178]">조건에 맞는 상품이 없어요.</p>
          )}
        </div>
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