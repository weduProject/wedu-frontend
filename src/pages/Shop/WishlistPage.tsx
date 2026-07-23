import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from './shopData';
import ProductCard from './components/ProductCard';
import { useWishlist } from './WishlistContext';

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishedIds, clearWishlist } = useWishlist();

  const wishedProducts = PRODUCTS.filter((product) =>
    wishedIds.includes(product.id),
  );

  return (
    <div className="mx-auto max-w-[1024px]">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#0D0A09]">찜한 상품</h1>

        {wishedProducts.length > 0 && (
          <button
            type="button"
            onClick={clearWishlist}
            className="text-sm text-[#968178] transition-colors hover:text-[#FC4A4D]"
          >
            전체 삭제
          </button>
        )}
      </div>

      <p className="mb-3 text-sm text-[#968178]">총 {wishedProducts.length}개</p>

      {wishedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {wishedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#EAE4D8] bg-white py-20 text-center">
          <p className="mb-4 text-sm text-[#7C6358]">아직 찜한 상품이 없어요.</p>
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="rounded-full bg-[#FC4A4D] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            편집샵 둘러보기
          </button>
        </div>
      )}
    </div>
  );
}