import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AtSign, ExternalLink, MapPin, Navigation, Image as ImageIcon } from 'lucide-react';
import Button from '../../components/ui/Button';
import { CATEGORIES, MOCK_PRODUCTS } from './mockProducts';
import { formatPrice } from './utils/formatPrice';
import { CATEGORY_BADGE, IMAGE_PLACEHOLDER_BG, SECONDARY_BTN, INSTA_LINK, MAP_BTN, BACK_BTN } from './styles';

export default function WeddingShopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = MOCK_PRODUCTS.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6">
        <ImageIcon className="h-12 w-12 text-text-muted" strokeWidth={1.5} />
        <p className="text-text-muted">상품을 찾을 수 없습니다.</p>
        <Link to="/wedding-shop" className="rounded-full bg-[#F0EEED] px-6 py-2.5 text-sm font-medium text-[#3E3939] no-underline hover:bg-[#E7E4E3]">
          웨딩 룩북으로 돌아가기
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discountPrice !== null && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const categoryName = CATEGORIES.find((c) => c.id === product.categoryId)?.name;
  const mapHref = 'https://map.kakao.com/?q=' + encodeURIComponent(product.address ?? '');

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Link to="/wedding-shop" className="no-underline hover:text-primary">웨딩 룩북</Link>
        <span>/</span>
        <span>{categoryName}</span>
        <span>/</span>
        <span className="truncate font-medium text-[#2B2827]">{product.name}</span>
      </div>

      <section className="pt-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className={'h-[474px] w-full overflow-hidden rounded-2xl ' + IMAGE_PLACEHOLDER_BG}>
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover object-top" />
          </div>

          <div className="flex flex-col justify-center gap-6">
            <span className={CATEGORY_BADGE}>{categoryName}</span>
            <h1 className="text-[48px] font-semibold leading-[48px] text-[#0C0B0A]">{product.name}</h1>
            <p className="max-w-lg text-base leading-[26px] text-[#6F6765]">{product.description}</p>

            <div className="flex items-center gap-3">
              <span className="text-[36px] font-bold leading-10 text-[#0C0B0A]">₩{formatPrice(displayPrice)}</span>
              {hasDiscount ? <span className="text-lg text-text-muted line-through">₩{formatPrice(product.price)}</span> : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="pill" size="lg" onClick={() => navigate('/wedding-estimate')} className="flex-1">
                견적 문의하기
              </Button>
              <button type="button" onClick={() => navigate('/connect')} className={SECONDARY_BTN}>
                파트너와 상담하기
              </button>
            </div>

            {product.instagramUrl ? (
              <div className="mt-2 rounded-2xl border border-[rgba(231,228,227,0.6)] bg-[#F0EEED] p-[25px]">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#F472B6_0%,#F87171_50%,#FACC15_100%)]">
                    <AtSign className="h-5 w-5 text-white" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#181515]">실제 업체 인스타그램</p>
                    <p className="text-xs text-text-muted">포트폴리오와 실제 후기를 확인해보세요</p>
                  </div>
                </div>
                <a href={product.instagramUrl} target="_blank" rel="noopener noreferrer" className={INSTA_LINK}>
                  <AtSign className="h-4 w-4 text-[#3E3939]" strokeWidth={1.8} />
                  <span className="text-sm font-medium text-[#3E3939]">인스타그램에서 더 보기</span>
                  <ExternalLink className="h-3.5 w-3.5 text-text-muted" strokeWidth={1.8} />
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {product.address ? (
        <section className="pt-16">
          <div className="rounded-[32px] border border-[rgba(231,228,227,0.6)] bg-white p-8">
            <div className="flex flex-col gap-10 lg:flex-row">
              <div className="flex flex-col justify-center gap-4 lg:w-80">
                <span className={CATEGORY_BADGE}>Location</span>
                <h2 className="text-[30px] font-semibold leading-9 text-[#0C0B0A]">찾아오시는 길</h2>
                <div className="flex items-start gap-3 rounded-xl bg-[#FAF8F8] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAE4CC]">
                    <MapPin className="h-4 w-4 text-[#8C6638]" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="mb-0.5 text-sm font-semibold text-[#181515]">{product.name}</p>
                    <p className="text-sm leading-[23px] text-[#6F6765]">{product.address}</p>
                  </div>
                </div>
                <a href={mapHref} target="_blank" rel="noopener noreferrer" className={MAP_BTN}>
                  <Navigation className="h-4 w-4" strokeWidth={1.8} />
                  길찾기
                </a>
              </div>
              <div className={'min-h-75 flex-1 overflow-hidden rounded-xl lg:min-h-100 ' + IMAGE_PLACEHOLDER_BG}>
                <iframe
                  src={'https://maps.google.com/maps?q=' + encodeURIComponent(product.address) + '&z=16&output=embed'}
                  className="h-full w-full"
                  style={{ border: 0, minHeight: 300 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={product.name + ' 위치'}
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-16">
        <div className="flex justify-center">
          <Link to="/wedding-shop" className={BACK_BTN}>
            <ArrowLeft className="h-4 w-4" strokeWidth={1.8} />
            웨딩 룩북으로 돌아가기
          </Link>
        </div>
      </section>
    </div>
  );
}