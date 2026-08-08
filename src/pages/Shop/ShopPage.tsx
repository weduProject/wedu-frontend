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
    <div className="-m-5 md:-m-8">
      <ShopHero />

      <div className="relative">
        <CategoryFilter
          categories={CATEGORIES}
          activeCategory={filters.category}
          onCategoryChange={(category) => setFilters((prev) => ({ ...prev, category }))}
        />

        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <StyleAndSearchBar
            styleTags={STYLE_TAGS}
            activeStyle={filters.styleTag}
            onStyleChange={(styleTag) => setFilters((prev) => ({ ...prev, styleTag }))}
            keyword={keyword}
            onKeywordChange={setKeyword}
          />

          <div ref={gridRef} className="scroll-mt-6 pb-14 pt-6">
            <p className="mb-3 text-sm text-[#968178]">총 {products.length}개</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {products.length === 0 && (
              <p className="mt-10 text-center text-sm text-[#968178]">조건에 맞는 상품이 없어요.</p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 pb-8 md:px-8">
        <TasteFinder selected={selectedTastes} onToggle={toggleTaste} />
      </div>

      <div className="mx-auto max-w-5xl px-5 pb-14 md:px-8">
        <ShopCTA />
      </div>
    </div>
  );
}