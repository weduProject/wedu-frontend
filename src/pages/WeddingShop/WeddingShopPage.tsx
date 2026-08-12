import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Heart } from 'lucide-react';
import clsx from 'clsx';
import { PRIMARY_GRADIENT_BG, PRIMARY_GLOW_SHADOW } from '../../styles/gradients';
import { CATEGORIES, MOCK_PRODUCTS } from './mockProducts';
import { formatPrice } from './utils/formatPrice';
import { IMAGE_PLACEHOLDER_BG, CARD_BORDER } from './styles';
import weddingShopHeroBg from '../../assets/wedding-shop/hero.jpg';
import weddingShopCtaBg from '../../assets/wedding-shop/cta.jpg';

export default function WeddingShopPage() {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const filteredProducts = activeCategory ? MOCK_PRODUCTS.filter((p) => p.categoryId === activeCategory) : MOCK_PRODUCTS;

  return (
    <div className="-m-5 md:-m-8">
      <section className="relative">
        <div className="relative h-[658px] w-full overflow-hidden">
          <img src={weddingShopHeroBg} alt="웨딩 룩북" className="h-full w-full object-cover object-top" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.4) 100%)' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <span className="mb-6 inline-block rounded-full border border-white/20 bg-white/15 px-[17px] py-[7px] text-sm font-medium tracking-[2.8px] text-white/90 backdrop-blur-[6px]">
              Wedding Lookbook
            </span>
            <h1 className="max-w-3xl text-[60px] font-semibold leading-15 tracking-[-1.5px] text-white">당신의 웨딩을 완성할 룩북</h1>
            <p className="mt-6 max-w-xl text-lg leading-7 text-white/70">베뉴부터 드레스, 허니문까지 — 실제 웨딩 업체들의 포트폴리오를 룩북처럼 만나보세요.</p>
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-30 border-b border-[#E7E4E3]/60 bg-[#FAF8F8]/80 backdrop-blur-[12px] md:top-20">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <div className="flex items-center gap-3 overflow-x-auto py-4 scrollbar-hide">
            <button type="button" onClick={() => setActiveCategory(null)} className={clsx('shrink-0 whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors', activeCategory === null ? 'bg-text text-white' : 'bg-[#F0EEED] text-text-muted hover:bg-[#E7E4E3]')}>
              전체
            </button>
            {CATEGORIES.map((cat) => (
              <button key={cat.id} type="button" onClick={() => setActiveCategory(cat.id)} className={clsx('shrink-0 whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors', activeCategory === cat.id ? 'bg-text text-white' : 'bg-[#F0EEED] text-text-muted hover:bg-[#E7E4E3]')}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-14 md:px-8">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-32">
            <ImageIcon className="h-10 w-10 text-text-muted" strokeWidth={1.5} />
            <p className="text-sm text-text-muted">해당 카테고리에 상품이 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const hasDiscount = product.discountPrice !== null && product.discountPrice < product.price;
              const displayPrice = hasDiscount ? product.discountPrice! : product.price;
              return (
                <Link key={product.id} to={'/wedding-shop/' + product.id} className={clsx('group block overflow-hidden rounded-2xl border bg-white no-underline transition-colors hover:border-[#D9C9C6]', CARD_BORDER)}>
                  <div className={clsx('relative h-[231px] w-full overflow-hidden', IMAGE_PLACEHOLDER_BG)}>
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                    {hasDiscount ? (
                      <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white">
                        {Math.round(((product.price - product.discountPrice!) / product.price) * 100)}% OFF
                      </span>
                    ) : null}
                    <button type="button" onClick={(e) => e.preventDefault()} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100" aria-label="찜하기">
                      <Heart className="h-3.5 w-3.5 text-text-muted" strokeWidth={1.8} />
                    </button>
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium tracking-[0.3px] text-text-muted">{CATEGORIES.find((c) => c.id === product.categoryId)?.name}</span>
                    <h3 className="mt-1.5 line-clamp-1 text-base font-semibold leading-6 text-[#181515]">{product.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-text-muted">{product.description}</p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-lg font-bold text-[#0C0B0A]">₩{formatPrice(displayPrice)}</span>
                      {hasDiscount ? <span className="text-xs text-text-muted line-through">₩{formatPrice(product.price)}</span> : null}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-14 md:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-[#F0EEED]">
          <img src={weddingShopCtaBg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
          <div className="relative flex flex-col items-center justify-between gap-6 px-8 py-10 md:flex-row md:px-12 md:py-14">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-semibold text-[#181515] md:text-3xl">맞춤 견적이 필요하신가요?</h2>
              <p className="mt-2 max-w-md text-sm text-text-muted md:text-base">웨딩 플래너가 당신만을 위한 커스텀 견적을 제안해 드립니다.</p>
            </div>
            <Link to="/wedding-estimate" className={clsx('whitespace-nowrap rounded-full px-8 py-3 text-sm font-medium text-white no-underline transition-opacity hover:opacity-90', PRIMARY_GRADIENT_BG, PRIMARY_GLOW_SHADOW)}>
              파트너와 함께 준비하기
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}