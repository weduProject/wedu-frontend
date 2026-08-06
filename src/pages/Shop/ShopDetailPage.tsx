import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from './shopData';
import { useWishlist } from './utils/useWishlist';
import { useCart } from './CartContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import clsx from 'clsx';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function ShopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isWished, toggleWish } = useWishlist();
  const { isInCart, addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const product = PRODUCTS.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl py-20 text-center">
        <p className="text-[#7C6358]">상품을 찾을 수 없어요.</p>
        <Button variant="pill" onClick={() => navigate('/shop')} className="mt-4">
          편집샵으로 돌아가기
        </Button> 
      </div>
    );
  }

  const liked = isWished(product.id);
  const inCart = isInCart(product.id);
  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const handleWishClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    toggleWish(product.id);
  };

  const handleCartClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product.id);
  };

  // 상품 속성 태그 (스타일 / 분위기 / 장소) — 다이닝 전용 아님, 전 카테고리 공통
  const attributeTags = [
    { icon: '🍽️', label: '스타일', value: product.styleTag },
    { icon: '🕯️', label: '분위기', value: product.moodTag },
    { icon: '📍', label: '장소', value: product.locationTag },
  ].filter((attr) => Boolean(attr.value));

  return (
    <div className="mx-auto max-w-5xl">
      <nav className="mb-6 flex items-center gap-2 text-sm text-text-muted">
        <Link to="/shop" className="hover:text-primary">
          프로포즈 편집실
        </Link>
        <span>›</span>
        <span className="text-text">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="h-96 w-full overflow-hidden rounded-2xl bg-primary-light">
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
            <span className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-[#463730]">
              {product.category}
            </span>
            {product.styles.map((style) => (
              <span
                key={style}
                className="rounded-full bg-primary-light px-2.5 py-1 text-xs font-medium text-primary"
              >
                {style}
              </span>
            ))}
          </div>

          {/* 상품 속성 태그: 포함 사항 아이콘(#FEF3E7 / #C69356)과 동일한 톤 재사용 */}
          {attributeTags.length > 0 && (
            <div className="mb-5 flex flex-nowrap gap-1.5 overflow-x-auto">
              {attributeTags.map((attr) => (
                <span
                  key={attr.label}
                  className="flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-[#FEF3E7] px-2.5 py-1 text-xs font-medium text-[#8A5E2C]"
                >
                  <span className="text-xs leading-none">{attr.icon}</span>
                  {attr.label} · {attr.value}
                </span>
              ))}
            </div>
          )}

          {/* 제목 + 인스타그램 로고 아이콘 (원형 배경 없이 아이콘만, 브랜드 코랄 컬러) */}
          <div className="mb-3 flex items-center gap-2">
            <h1 className="text-3xl font-bold text-text">{product.title}</h1>
            {product.instagramUrl && (
              <a
                href={product.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인스타그램에서 보기"
                className="translate-y-1 text-primary transition-opacity hover:opacity-70"
              >
                <InstagramIcon className="h-6 w-6" />
              </a>
            )}
          </div>

          <p className="mb-5 text-sm leading-6 text-[#7C6358]">
            {product.detailDescription}
          </p>

          <div className="mb-5">
            <span className="text-3xl font-bold text-text">
              {product.price.replace('~', '')}
            </span>
            <span className="ml-1 text-sm text-text-muted">부터</span>
          </div>

          <div className="mb-5">
            <h3 className="mb-2 text-sm font-semibold text-text">포함 사항</h3>
            <ul className="flex flex-col gap-1.5">
              {product.includes.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#594941]">
                  <span className="text-primary">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6 flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-[#FAF8F4] px-2 py-0.5 text-xs text-text-muted"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <button
              type="button"
              onClick={handleCartClick}
              disabled={inCart}
              className={clsx(
                'flex items-center justify-center gap-1.5 rounded-full py-3.5 text-sm font-semibold transition-opacity',
                inCart
                  ? 'bg-[#F0EEED] text-[#6F6765] cursor-not-allowed'
                  : 'bg-[linear-gradient(111.47deg,#F79689_0%,#E8796C_33.33%,#FEABA0_66.67%,#E8796C_100%)] text-white shadow-[0px_4px_14px_rgba(161,86,77,0.18),0px_0px_24px_rgba(232,121,108,0.28),inset_0px_1px_0px_rgba(255,255,255,0.2)] hover:opacity-90',
              )}
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.8} />
              {inCart ? '담았어요' : '장바구니에 담기'}
            </button>
            <button
              type="button"
              aria-pressed={liked}
              onClick={handleWishClick}
              className="group flex items-center justify-center gap-1.5 rounded-full border border-border py-3.5 text-sm font-medium text-[#594941] transition-colors hover:bg-[#FAF8F5]"
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
        <h2 className="mb-4 text-lg font-bold text-text">함께 보면 좋은 상품</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {related.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(`/shop/${item.id}`)}
              className="flex flex-col rounded-2xl border border-border bg-white p-4 text-left transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-text">
                  {item.title}
                </span>
                <span className="text-text-muted" aria-hidden>→</span>
              </div>
              <p className="mb-2 text-xs leading-5 text-[#7C6358]">
                {item.description}
              </p>
              <span className="text-sm font-bold text-text">{item.price}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}