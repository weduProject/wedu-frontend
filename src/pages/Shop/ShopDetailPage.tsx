import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingBag, AtSign, ExternalLink, MapPin, Navigation } from 'lucide-react';
import { PRODUCTS } from './shopData';
import { useWishlist } from './utils/useWishlist';
import { useCart } from './CartContext';
import { useAuth } from '../../contexts/AuthContext';
import clsx from 'clsx';
import { formatWon } from './utils/price';

export default function ShopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isWished, toggleWish } = useWishlist();
  const { isInCart, addToCart, removeFromCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const product = PRODUCTS.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl py-20 text-center">
        <p className="text-[#7C6358]">상품을 찾을 수 없어요.</p>
        <Link to="/shop" className="mt-4 inline-block rounded-full bg-[#F0EEED] px-6 py-2.5 text-sm font-medium text-[#3E3939] no-underline hover:bg-[#E7E4E3]">
          편집샵으로 돌아가기
        </Link>
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
    if (inCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product.id);
    }
  };

  const attributeTags = [
    { label: '스타일', value: product.styleTag },
    { label: '분위기', value: product.moodTag },
    { label: '장소', value: product.locationTag },
  ].filter((attr) => Boolean(attr.value));

  const mapQuery = product.locationTag ?? '';
  const mapHref = 'https://map.kakao.com/?q=' + encodeURIComponent(mapQuery);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link to="/shop" className="no-underline hover:text-primary">프로포즈 편집실</Link>
        <span>/</span>
        <span className="truncate font-medium text-[#2B2827]">{product.title}</span>
      </div>

      <section className="pt-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* 왼쪽: 이미지 + 지도 */}
          <div className="flex flex-col gap-6">
            <div className="h-[380px] w-full overflow-hidden rounded-2xl bg-[#F0EEED]">
              {product.image ? (
                <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
              ) : null}
            </div>

            {product.locationTag ? (
              <div className="rounded-2xl border border-[rgba(231,228,227,0.6)] bg-white p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAE4CC]">
                    <MapPin className="h-4 w-4 text-[#8C6638]" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="mb-0.5 text-sm font-semibold text-[#181515]">{product.title}</p>
                    <p className="text-sm text-[#6F6765]">{product.locationTag}</p>
                  </div>
                </div>

                <div className="mb-3 h-[220px] w-full overflow-hidden rounded-xl bg-[#F0EEED]">
                  <iframe
                    src={'https://maps.google.com/maps?q=' + encodeURIComponent(mapQuery) + '&z=13&output=embed'}
                    className="h-full w-full"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={product.title + ' 위치'}
                  />
                </div>

                <a href={mapHref} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0C0B0A] px-5 py-3 text-sm font-medium text-white no-underline transition-opacity hover:opacity-90">
                  <Navigation className="h-4 w-4" strokeWidth={1.8} />
                  길찾기
                </a>
              </div>
            ) : null}
          </div>

          {/* 오른쪽: 상품 정보 */}
          <div className="flex flex-col justify-center gap-6">
            <span className="inline-block w-fit rounded-full bg-[#FAE4CC] px-3 py-1 text-xs font-medium tracking-[0.3px] text-[#715129]">
              {product.category}
            </span>

            <h1 className="text-[40px] font-semibold leading-[44px] text-[#0C0B0A]">{product.title}</h1>

            {attributeTags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {attributeTags.map((attr) => (
                  <span key={attr.label} className="rounded-full bg-[#FEF3E7] px-2.5 py-1 text-xs font-medium text-[#8A5E2C]">
                    {attr.label} · {attr.value}
                  </span>
                ))}
              </div>
            ) : null}

            <p className="max-w-lg text-base leading-[26px] text-[#6F6765]">{product.detailDescription}</p>

            <div className="flex items-center gap-3">
              <span className="text-[32px] font-bold text-[#0C0B0A]">{formatWon(product.price)}</span>
              <span className="text-sm text-text-muted">부터</span>
            </div>

            <div>
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

            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-md bg-[#FAF8F4] px-2 py-0.5 text-xs text-text-muted">#{tag}</span>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleCartClick}
                aria-pressed={inCart}
                className={clsx(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-full py-3.5 text-sm font-semibold transition-opacity',
                  inCart
                    ? 'bg-[#F0EEED] text-[#6F6765] hover:bg-[#E7E4E3]'
                    : 'bg-[linear-gradient(111.47deg,#F79689_0%,#E8796C_33.33%,#FEABA0_66.67%,#E8796C_100%)] text-white shadow-[0px_4px_14px_rgba(161,86,77,0.18),0px_0px_24px_rgba(232,121,108,0.28),inset_0px_1px_0px_rgba(255,255,255,0.2)] hover:opacity-90',
                )}
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.8} />
                {inCart ? '취소' : '장바구니에 담기'}
              </button>
              <button type="button" aria-pressed={liked} onClick={handleWishClick} className="group flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border py-3.5 text-sm font-medium text-[#594941] transition-colors hover:bg-[#FAF8F5]">
                <Heart className={liked ? 'h-4 w-4 fill-primary text-primary' : 'h-4 w-4 text-[#594941] transition-colors group-hover:fill-primary group-hover:text-primary'} strokeWidth={1.8} />
                {liked ? '찜 완료' : '찜하기'}
              </button>
            </div>

            {product.instagramUrl ? (
              <div className="rounded-2xl border border-[rgba(231,228,227,0.6)] bg-[#F0EEED] p-[25px]">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#F472B6_0%,#F87171_50%,#FACC15_100%)]">
                    <AtSign className="h-5 w-5 text-white" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#181515]">실제 업체 인스타그램</p>
                    <p className="text-xs text-text-muted">포트폴리오와 실제 후기를 확인해보세요</p>
                  </div>
                </div>
                <a href={product.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#E7E4E3] bg-white px-5 py-3 no-underline transition-colors hover:border-[#D9C9C6]">
                  <AtSign className="h-4 w-4 text-[#3E3939]" strokeWidth={1.8} />
                  <span className="text-sm font-medium text-[#3E3939]">인스타그램에서 더 보기</span>
                  <ExternalLink className="h-3.5 w-3.5 text-text-muted" strokeWidth={1.8} />
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="py-16">
        <h2 className="mb-4 text-lg font-bold text-text">함께 보면 좋은 상품</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {related.map((item) => (
            <button key={item.id} type="button" onClick={() => navigate(`/shop/${item.id}`)} className="flex flex-col rounded-2xl border border-border bg-white p-4 text-left transition-shadow hover:shadow-md">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-text">{item.title}</span>
                <span className="text-text-muted" aria-hidden>→</span>
              </div>
              <p className="mb-2 text-xs leading-5 text-[#7C6358]">{item.description}</p>
              <span className="text-sm font-bold text-text">{formatWon(item.price)}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}