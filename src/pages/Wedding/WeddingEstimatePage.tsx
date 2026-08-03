import { WEDDING_PRODUCTS } from './weddingData';
import ProductCard from '../Shop/components/ProductCard';

const SECTIONS: { key: '예식장' | '예물' | '신혼여행'; title: string; description: string }[] = [
  {
    key: '예식장',
    title: '예식장 견적',
    description: '홀 분위기와 규모별 예식 공간을 비교해보세요',
  },
  {
    key: '예물',
    title: '예물 견적',
    description: '커플링부터 예단까지, 예물 구성을 살펴보세요',
  },
  {
    key: '신혼여행',
    title: '신혼여행 견적',
    description: '휴양부터 액티브 코스까지, 신혼여행지를 둘러보세요',
  },
];

export default function WeddingEstimatePage() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-text">웨딩 견적</h1>
        <p className="text-sm text-text-muted">
          프로포즈 편집샵뿐 아니라, 웨딩 준비의 큰 항목도 한 곳에서 미리 살펴보세요.
        </p>
      </div>

      <div className="flex flex-col gap-14">
        {SECTIONS.map((section) => {
          const items = WEDDING_PRODUCTS.filter(
            (product) => product.weddingCategory === section.key,
          );

          return (
            <section key={section.key}>
              <div className="mb-4 flex items-baseline justify-between">
                <div>
                  <h2 className="text-lg font-bold text-text">{section.title}</h2>
                  <p className="mt-1 text-sm text-text-muted">{section.description}</p>
                </div>
                <span className="text-sm text-text-muted">{items.length}개</span>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}