import { useState, useEffect } from 'react';
import { LayoutGrid, Gem, PartyPopper, Flower2, Camera, Mail, Music } from 'lucide-react';
import ShopHero from './components/ShopHero';
import CategoryFilter from './components/CategoryFilter';
import StyleAndSearchBar from './components/StyleAndSearchBar';
import ProductCard from './components/ProductCard';
import TasteFinder from './components/TasteFinder';
import ShopCTA from './components/ShopCTA';
import { fetchProducts } from './shopApi';
import type { DisplayProduct } from './shopApi';

const CATEGORIES = [
  { id: '전체', label: '전체', Icon: LayoutGrid },
  { id: 'RING', label: '주얼리', Icon: Gem },
  { id: 'EVENT', label: '이벤트/공간', Icon: PartyPopper },
  { id: 'FLOWER', label: '플라워', Icon: Flower2 },
  { id: 'PHOTO', label: '사진/영상', Icon: Camera },
  { id: 'LETTER', label: '편지/레터', Icon: Mail },
  { id: 'ETC', label: '기타', Icon: Music },
] as const;

const STYLE_TAGS = ['전체 스타일', '로맨틱', '우아한', '럭셔리', '감성적', '모던', '아늑한', '깜짝', '모험적'];

export default function ShopPage() {
  const [filters, setFilters] = useState({ category: '전체', styleTag: '전체 스타일' });
  const [selectedTastes, setSelectedTastes] = useState<string[]>([]);
  const [keyword, setKeyword] = useState('');

  const [allProducts, setAllProducts] = useState<DisplayProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchProducts({
      category: filters.category === '전체' ? undefined : filters.category,
      keyword: keyword || undefined,
      size: 100, // 지금은 상품이 24개뿐이니 넉넉하게
    })
      .then(setAllProducts)
      .catch((err) => console.warn('상품 목록 조회 실패', err))
      .finally(() => setIsLoading(false));
  }, [filters.category, keyword]);

  // "총 N개" 문구를 id로 타겟팅해서 scrollIntoView로 스크롤.
  // 실제 여백은 아래 <div id="product-grid">의 scroll-mt-* 클래스(반응형)가 담당함.
  function scrollToGrid() {
    const el = document.getElementById('product-grid');
    if (!el) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function handleCategoryChange(category: string) {
    setFilters((prev) => ({ ...prev, category }));
    scrollToGrid();
  }

  function toggleTaste(label: string) {
    setSelectedTastes((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
    scrollToGrid();
  }

  const products = allProducts.filter((product) => {
    const styleMatch = filters.styleTag === '전체 스타일' || product.styles.includes(filters.styleTag);
    const tasteMatch = selectedTastes.length === 0 || selectedTastes.some((t) => product.tastes.includes(t));
    return styleMatch && tasteMatch;
  });

  return (
    <div className="-m-5 md:-m-8">
      <ShopHero />

      <div className="relative">
        <CategoryFilter
          categories={CATEGORIES}
          activeCategory={filters.category}
          onCategoryChange={handleCategoryChange}
        />

        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <StyleAndSearchBar
            styleTags={STYLE_TAGS}
            activeStyle={filters.styleTag}
            onStyleChange={(styleTag) => setFilters((prev) => ({ ...prev, styleTag }))}
            keyword={keyword}
            onKeywordChange={setKeyword}
          />

          <div id="product-grid" className="scroll-mt-[130px] pb-14 pt-6 md:scroll-mt-[158px]">
            {isLoading ? (
              <p className="py-20 text-center text-sm text-text-muted">불러오는 중...</p>
            ) : (
              <>
                <p className="mb-3 text-sm text-[#968178]">총 {products.length}개</p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                {products.length === 0 && (
                  <p className="mt-10 text-center text-sm text-[#968178]">조건에 맞는 상품이 없어요.</p>
                )}
              </>
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