import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { PRODUCTS } from './shopData';
import { useWishlist } from './WishlistContext';
import { useAuth } from '../../contexts/AuthContext';

export default function ShopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isWished, toggleWish } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const product = PRODUCTS.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="mx-auto max-w-[1024px] py-20 text-center">
        <p className="text-[#7C6358]">상품을 찾을 수 없어요.</p>
        <button
          type="button"
          onClick={() => navigate('/shop')}
          className="mt-4 rounded-full bg-[#FC4A4D] px-5 py-2.5 text-sm font-semibold text-white"
        >
          편집샵으로 돌아가기
        </button>
      </div>
    );
  }

  const liked = isWished(product.id);
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const handleWishClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    toggleWish(product.id);
  };

  return (
    <div className="mx-auto max-w-[1024px]">
      <nav className="mb-6 flex items-center gap-2 text-sm text-[#968178]">
        <Link to="/shop" className="hover:text-[#FC4A4D]">
          프로포즈 편집실
        </Link>
        <span>›</span>
        <span className="text-[#0D0A09]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="h-96 w-full overflow-hidden rounded-2xl bg-[#F2EEE6]">
          {product.image && (
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#F2EEE6] px-2.5 py-1 text-xs font-medium text-[#463730]">
              {product.category}
            </span>
            {product.styles.map((style) => (
              <span
                key={style}
                className="rounded-full bg-[#FDF2F6] px-2.5 py-1 text-xs font-medium text-[#FC4A4D]"
              >
                {style}
              </span>
            ))}
          </div>

          <h1 className="mb-3 text-3xl font-bold text-[#0D0A09]">
            {product.title}
          </h1>

          <p className="mb-5 text-sm leading-6 text-[#7C6358]">
            {product.detailDescription}
          </p>

          <div className="mb-5">
            <span className="text-3xl font-bold text-[#0D0A09]">
              {product.price.replace('~', '')}
            </span>
            <span className="ml-1 text-sm text-[#968178]">부터</span>
          </div>

          <div className="mb-5">
            <h3 className="mb-2 text-sm font-semibold text-[#0D0A09]">포함 사항</h3>
            <ul className="flex flex-col gap-1.5">
              {product.includes.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#594941]">
                  <span className="text-[#FC4A4D]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6 flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-[#FAF8F4] px-2 py-0.5 text-xs text-[#968178]"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <button
              type="button"
              className="rounded-xl bg-[#FC4A4D] py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              장바구니에 담기
            </button>
            <button
              type="button"
              aria-pressed={liked}
              onClick={handleWishClick}
              className="group flex items-center justify-center gap-1.5 rounded-xl border border-border py-3.5 text-sm font-medium text-[#594941] transition-colors hover:bg-[#FAF8F5]"
            >
              <Heart
                className={
                  liked
                    ? 'h-4 w-4 text-primary fill-primary'
                    : 'h-4 w-4 text-[#594941] transition-colors group-hover:fill-primary group-hover:text-primary'
                }
                strokeWidth={1.8}
              />
              {liked ? '찜 완료' : '찜하기'}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-4 text-lg font-bold text-[#0D0A09]">함께 보면 좋은 상품</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {related.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(`/shop/${item.id}`)}
              className="flex flex-col rounded-2xl border border-[#EAE4D8] bg-white p-4 text-left transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0D0A09]">
                  {item.title}
                </span>
                <span className="text-[#968178]" aria-hidden>→</span>
              </div>
              <p className="mb-2 text-xs leading-5 text-[#7C6358]">
                {item.description}
              </p>
              <span className="text-sm font-bold text-[#0D0A09]">{item.price}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}