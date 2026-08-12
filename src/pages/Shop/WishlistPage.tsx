import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from './components/ProductCard';
import { useWishlist } from './utils/useWishlist';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components';
import { fetchProductDetail } from './shopApi';
import type { DisplayProduct } from './shopApi';
import { groupByCategory } from './utils/groupByCategory';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wishedIds, clearWishlist } = useWishlist();
  const [wishedProducts, setWishedProducts] = useState<DisplayProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (wishedIds.length === 0) {
      setWishedProducts([]);
      return;
    }
    setIsLoading(true);
    Promise.all(wishedIds.map((id) => fetchProductDetail(id)))
      .then(setWishedProducts)
      .catch((err) => console.warn('찜 상품 조회 실패', err))
      .finally(() => setIsLoading(false));
  }, [wishedIds]);

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white py-20 text-center">
          <p className="mb-4 text-sm text-[#7C6358]">
            찜한 상품은 로그인 후 확인할 수 있어요.
          </p>
          <Button variant="wishlist" onClick={() => navigate('/login')}>
            로그인하러 가기
          </Button>
        </div>
      </div>
    );
  }

  const groupedProducts = groupByCategory(wishedProducts);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">찜한 상품</h1>

        {wishedIds.length > 0 && (
          <Button variant="pill" size="sm" className="px-4 py-2 text-xs" onClick={clearWishlist}>
            전체 삭제
          </Button>
        )}
      </div>

      <p className="mb-3 text-sm text-text-muted">총 {wishedProducts.length}개</p>

      {isLoading ? (
        <p className="py-20 text-center text-sm text-text-muted">불러오는 중...</p>
      ) : wishedProducts.length > 0 ? (
        <div className="flex flex-col gap-8">
          {Object.entries(groupedProducts).map(([label, products]) => (
            <section key={label}>
              <h2 className="mb-3 text-sm font-semibold text-text-muted">
                {label} · {products.length}개
              </h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white py-20 text-center">
          <p className="mb-4 text-sm text-[#7C6358]">아직 찜한 상품이 없어요.</p>
          <Button variant="wishlist" onClick={() => navigate('/shop')}>
            편집샵 둘러보기
          </Button>
        </div>
      )}
    </div>
  );
}