import { useNavigate } from 'react-router-dom';

// TODO: 백엔드 연동 시 GET /api/recommend/place, /api/recommend/style 응답으로 교체
interface PackageItem {
  id: number;
  title: string;
  location: string;
  price: string;
  rating: number;
  reviewCount: number;
  image?: string;
}

const PACKAGE_ITEMS: PackageItem[] = [
  {
    id: 1,
    title: '스카이뷰 호텔 페키지',
    location: '서울 강남구',
    price: '₩ 450,000',
    rating: 4.8,
    reviewCount: 120,
  },
  {
    id: 2,
    title: '프라이빗 다이닝 페키지',
    location: '서울 이태원',
    price: '₩ 350,000',
    rating: 4.7,
    reviewCount: 86,
  },
  {
    id: 3,
    title: '감성 야외 프로포즈',
    location: '경기 가평',
    price: '₩ 250,000',
    rating: 4.9,
    reviewCount: 203,
  },
  {
    id: 4,
    title: '비치 썬셋 프로포즈',
    location: '부산 해운대',
    price: '₩ 500,000',
    rating: 4.6,
    reviewCount: 54,
  },
];

export default function PopularPackages() {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-8 bg-[#F1EEE7]">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-bold text-text mb-2">인기 프로포즈 페키지</h3>
          <p className="text-sm text-text-muted">
            WEDU 큐레이터가 엄선한 최고의 장소와 서비스를 만나보세요
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGE_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate('/login')}
              className="group relative flex h-95 flex-col overflow-hidden rounded-xl text-left"
            >
              <div className="absolute inset-0 bg-primary-light">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

              <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#433831] backdrop-blur-sm">
                {item.location}
              </span>

              <div className="relative mt-auto flex flex-col gap-1 p-5">
                <p className="text-xs text-white/70">
                  ★ {item.rating.toFixed(1)} ({item.reviewCount})
                </p>
                <h4 className="text-base font-semibold text-white">{item.title}</h4>
                <p className="text-sm text-white/80">{item.price}~</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}