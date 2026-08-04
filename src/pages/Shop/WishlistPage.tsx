import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from './shopData';
import ProductCard from './components/ProductCard';
import { useWishlist } from './utils/useWishlist';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wishedIds, clearWishlist } = useWishlist();

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

  const wishedProducts = PRODUCTS.filter((product) =>
    wishedIds.includes(product.id),
  );

  const groupedProducts = wishedProducts.reduce<Record<string, typeof wishedProducts>>(
    (acc, product) => {
      (acc[product.categoryType] ??= []).push(product);
      return acc;
    },
    {},
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">찜한 상품</h1>

        {wishedProducts.length > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="rounded-full bg-[linear-gradient(111.47deg,#F79689_0%,#E8796C_33.33%,#FEABA0_66.67%,#E8796C_100%)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-[0px_4px_14px_rgba(161,86,77,0.18),0px_0px_24px_rgba(232,121,108,0.28),inset_0px_1px_0px_rgba(255,255,255,0.2)]"
          >
            전체 삭제
          </button>
        )}
      </div>

      <p className="mb-3 text-sm text-text-muted">총 {wishedProducts.length}개</p>

      {wishedProducts.length > 0 ? (
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