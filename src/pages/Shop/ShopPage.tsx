import { useState } from 'react';
import ShopHero from './components/ShopHero';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal'; 
import TasteFinder from './components/TasteFinder';
import ShopCTA from './components/ShopCTA';
import { PRODUCTS } from './shopData';
import type { Product } from './shopData'; 

const CATEGORIES = ['전체', '장소', '서비스', '경험', '선물'];
const STYLE_TAGS = ['전체 스타일', '로맨틱', '우아한', '모험적', '아늑한', '깜짝', '감성적'];

export default function ShopPage() {
  const [filters, setFilters] = useState({
    category: '전체',
    styleTag: '전체 스타일',
  });

  // 상세 모달에 띄울 상품 (null이면 닫힘)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products = PRODUCTS;

  return (
    <div className="mx-auto max-w-[1024px]">
      <ShopHero />

      <div className="mt-8">
        <CategoryFilter
          categories={CATEGORIES}
          styleTags={STYLE_TAGS}
          activeCategory={filters.category}
          activeStyle={filters.styleTag}
          onCategoryChange={(category) =>
            setFilters((prev) => ({ ...prev, category }))
          }
          onStyleChange={(styleTag) =>
            setFilters((prev) => ({ ...prev, styleTag }))
          }
        />
      </div>

      {/* 상품 그리드 — onDetailClick으로 모달 열기 */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDetailClick={setSelectedProduct}
          />
        ))}
      </div>

      <div className="mt-8">
        <TasteFinder />
      </div>

      <div className="mt-8">
        <ShopCTA />
      </div>

      {/* 상세 모달 — selectedProduct 있을 때만 뜸 */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}