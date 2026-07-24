import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from './shopData';
import ProductCard from './components/ProductCard';
import { useWishlist } from './WishlistContext';
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

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">찜한 상품</h1>

        {wishedProducts.length > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            전체 삭제
          </button>
        )}
      </div>

      <p className="mb-3 text-sm text-text-muted">총 {wishedProducts.length}개</p>

      {wishedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wishedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
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