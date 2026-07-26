import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PRODUCTS } from './shopData';

export default function ShopDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // TODO: 전역 상태로 교체 예정 — 찜 연동
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // TODO: 백엔드 상품상세 조회 API 호출로 교체
  const product = PRODUCTS.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="mx-auto max-w-[1024px] py-20 text-center">
        <p className="text-[#7C6358]">상품을 찾을 수 없어요.</p>
        <button
          type="button"
          onClick={() => navigate('/shop')}
          className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
        >
          편집샵으로 돌아가기
        </button>
      </div>
    );
  }

  const related = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-[1024px]">
      <nav className="mb-6 flex items-center gap-2 text-sm text-[#968178]">
        <Link to="/shop" className="hover:text-primary">
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
                className="rounded-full bg-[#FDF2F6] px-2.5 py-1 text-xs font-medium text-primary"
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
                className="rounded-md bg-[#FAF8F4] px-2 py-0.5 text-xs text-[#968178]"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <button
              type="button"
              className="rounded-xl bg-primary py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              장바구니에 담기
            </button>
            <button
              type="button"
              aria-pressed={liked}
              onClick={() => setLiked((prev) => !prev)}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-[#EAE4D8] py-3.5 text-sm font-medium text-[#594941] transition-colors hover:bg-[#FAF8F5]"
            >
              <span className={liked ? 'text-primary' : 'text-[#594941]'}>
                {liked ? '♥' : '♡'}
              </span>
              찜하기
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
