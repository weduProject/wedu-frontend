import { useState } from 'react';
import ShopHero from './components/ShopHero';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import TasteFinder from './components/TasteFinder';
import ShopCTA from './components/ShopCTA';
import { PRODUCTS } from './shopData';

// ⚠️ 임시 색상 상수 — 나중에 index.css @theme 토큰으로 교체 예정
export const SHOP_COLORS = {
  accent: '#FC4A4D',    // 포인트 (버튼/가격)
  titleText: '#0D0A09', // 제목
  bodyText: '#7C6358',  // 본문 (브라운)
  mutedText: '#968178', // 보조
  cardBorder: '#EAE4D8',// 카드 테두리
  pillBg: '#F2EEE6',    // pill 배경
};

const CATEGORIES = ['전체', '장소', '서비스', '경험', '선물'];
const STYLE_TAGS = ['전체 스타일', '로맨틱', '우아한', '모험적', '아늑한', '깜짝', '감성적'];

export default function ShopPage() {
  // 필터 상태를 하나의 객체로 관리 (여러 조건 동시 적용에 유리)
  const [filters, setFilters] = useState({
    category: '전체',
    styleTag: '전체 스타일',
  });

  // TODO(데이터 연결): filters 값으로 PRODUCTS 실제 필터링
  const products = PRODUCTS;

  return (
    // PageLayout의 <main>이 이미 패딩을 주므로 바깥 래퍼/패딩 없음.
    // 콘텐츠 최대폭만 제한하고 가운데 정렬.
    <div className="mx-auto max-w-[1024px]">
      {/* 1. Hero 배너 */}
      <ShopHero />

      {/* 2. 카테고리 + 스타일 필터 */}
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

      {/* 3. 상품 카드 그리드 (3열) */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* 4. 취향으로 찾기 */}
      <div className="mt-8">
        <TasteFinder />
      </div>

      {/* 5. 하단 CTA 배너 */}
      <div className="mt-8">
        <ShopCTA />
      </div>
    </div>
  );
}