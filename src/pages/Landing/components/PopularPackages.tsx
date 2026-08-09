import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

// TODO: 백엔드 연동 시 GET /api/recommend/place 응답으로 교체
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
  { id: 1, title: '스카이뷰 호텔 패키지', location: '서울 강남구', price: '₩450,000~', rating: 4.8, reviewCount: 120, image: 'https://readdy.ai/api/search-image?query=Luxury%20hotel%20wedding%20venue%20ballroom%20elegant%20chandelier%20rose%20gold%20decor%20ivory%20table%20settings%20editorial%20wedding%20photography%20warm%20lighting%20high-end&width=600&height=800&seq=wedu-vendor-01&orientation=portrait' },
  { id: 2, title: '프라이빗 다이닝 패키지', location: '서울 이태원', price: '₩350,000~', rating: 4.7, reviewCount: 86, image: 'https://readdy.ai/api/search-image?query=Outdoor%20garden%20wedding%20venue%20floral%20arch%20greenery%20natural%20light%20romantic%20setting%20editorial%20photography%20high-end%20wedding%20details%20soft%20warm%20tones&width=600&height=800&seq=wedu-vendor-02&orientation=portrait' },
  { id: 3, title: '감성 야외 프로포즈', location: '경기 가평', price: '₩250,000~', rating: 4.9, reviewCount: 203, image: 'https://readdy.ai/api/search-image?query=Modern%20rooftop%20wedding%20venue%20city%20skyline%20night%20string%20lights%20elegant%20setup%20editorial%20photography%20luxury%20atmosphere%20warm%20rose%20gold%20tones&width=600&height=800&seq=wedu-vendor-03&orientation=portrait' },
  { id: 4, title: '비치 썬셋 프로포즈', location: '부산 해운대', price: '₩500,000~', rating: 4.6, reviewCount: 54, image: 'https://readdy.ai/api/search-image?query=Beach%20wedding%20venue%20sunset%20ocean%20view%20white%20drapes%20elegant%20setup%20editorial%20photography%20luxury%20romantic%20atmosphere%20warm%20golden%20hour%20light&width=600&height=800&seq=wedu-vendor-04&orientation=portrait' },
];

export default function VendorSection() {
  const navigate = useNavigate();
  const handleItemClick = () => {
    navigate('/shop');
  };

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="w-full px-6 md:px-16">
        <div className="mb-10 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-end">
          <h2 className="text-3xl font-bold text-text md:text-4xl">인기 프로포즈 패키지</h2>
          <p className="max-w-sm text-sm text-text-muted md:text-base">
            WEDU 큐레이터가 엄선한 최고의 장소와 서비스를 만나보세요
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PACKAGE_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={handleItemClick}
              className="group relative flex aspect-[3/4] flex-col overflow-hidden rounded-xl text-left"
            >
              <div className="absolute inset-0 bg-primary-light">
                {item.image && <img src={item.image} alt={item.title} className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[#433831] backdrop-blur-sm">
                {item.location}
              </span>
               <div className="relative mt-auto flex flex-col gap-1 p-5">
                <p className="flex items-center gap-1 text-xs text-white/70">
                  <Star className="h-3 w-3 fill-current" strokeWidth={1.8} />
                  {item.rating.toFixed(1)} ({item.reviewCount})
                </p>
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-white/80">{item.price}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}