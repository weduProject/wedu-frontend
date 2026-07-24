import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from './shopData';
import ProductCard from './components/ProductCard';
import { useWishlist } from './WishlistContext';
import { Button } from '../../components';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishedIds, clearWishlist } = useWishlist();

  const wishedProducts = PRODUCTS.filter((product) =>
    wishedIds.includes(product.id),
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">찜한 상품</h1>

        {wishedProducts.length > 0 && (
          <Button variant="pill" size="sm" onClick={clearWishlist}>
            전체 삭제
          </Button>
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