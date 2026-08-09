import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, ArrowRight } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

// TODO: 백엔드 연동 시 GET /api/recommendations 응답으로 교체
interface FeedItem {
  id: number;
  title: string;
  location: string;
  price: string;
  likes: number;
  category: '호텔' | '야외' | '파티룸' | '레스토랑' | '특별한 장소';
  tags: string[];
  image?: string;
}

const CATEGORIES = ['전체', '호텔', '야외', '파티룸', '레스토랑', '특별한 장소'] as const;

const FEED_ITEMS: FeedItem[] = [
  { id: 1, title: '스카이뷰 호텔 럭셔리 페키지', location: '서울 강남구', price: '₩450,000', likes: 234, category: '호텔', tags: ['호텔', '럭셔리'] },
  { id: 2, title: '가평 감성 정원 프로포즈', location: '경기 가평군', price: '₩280,000', likes: 189, category: '야외', tags: ['야외', '감성'] },
  { id: 3, title: '이태원 루프탑 나이트 프로포즈', location: '서울 이태원', price: '₩350,000', likes: 312, category: '특별한 장소', tags: ['파티룸', '나이트'] },
  { id: 4, title: '프라이빗 다이닝 페키지', location: '서울 청담동', price: '₩380,000', likes: 156, category: '레스토랑', tags: ['레스토랑', '프라이빗'] },
  { id: 5, title: '한강 요트 프로포즈', location: '서울 여의도', price: '₩680,000', likes: 278, category: '특별한 장소', tags: ['특별한 장소', '요트'] },
  { id: 6, title: '아트갤러리 모던 프로포즈', location: '서울 삼청동', price: '₩420,000', likes: 198, category: '특별한 장소', tags: ['특별한 장소', '모던'] },
  { id: 7, title: '부산 해운대 선셋 프로포즈', location: '부산 해운대', price: '₩520,000', likes: 445, category: '야외', tags: ['특별한 장소', '비치'] },
  { id: 8, title: '강원 스노우 마운틴 프로포즈', location: '강원 평창', price: '₩550,000', likes: 367, category: '야외', tags: ['야외', '겨울'] },
];

export default function FeedSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleItemClick = () => {
    if (user) {
      navigate('/shop');
    } else {
      navigate('/login');
    }
  };

  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORIES)[number]>('전체');
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());

  const items = activeCategory === '전체' ? FEED_ITEMS : FEED_ITEMS.filter((item) => item.tags.includes(activeCategory));

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="w-full px-6 md:px-16">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-text md:text-3xl">인기 프로포즈 피드</h2>
            <p className="text-sm text-text-muted">지금 가장 인기 있는 프로포즈 스타일을 만나보세요</p>
          </div>
          <button
            type="button"
            onClick={handleItemClick}
            className="inline-flex items-center gap-1 whitespace-nowrap bg-transparent text-sm font-medium text-primary transition-colors hover:opacity-80"
          >
            전체 보기
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                aria-pressed={active}
                className={
                  active
                    ? 'shrink-0 whitespace-nowrap rounded-full bg-text px-4 py-2 text-sm font-medium text-white transition-all'
                    : 'shrink-0 whitespace-nowrap rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-text-muted transition-all hover:border-primary/40'
                }
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={handleItemClick}
              className="group text-left"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-primary-light">
                {item.image && (
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                )}
                <span
                  onClick={(e) => toggleLike(e, item.id)}
                  role="button"
                  aria-label="찜하기"
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-colors hover:bg-white"
                >
                  <Heart
                    className={likedItems.has(item.id) ? 'h-4 w-4 fill-primary text-primary' : 'h-4 w-4 text-[#5C4840]'}
                    strokeWidth={1.8}
                  />
                </span>
              </div>

              <div className="pt-3">
                <h3 className="mb-1 line-clamp-2 text-sm font-medium leading-snug text-text">{item.title}</h3>
                <div className="mb-2 flex items-center gap-1 text-xs text-text-muted">
                  <MapPin className="h-3 w-3" strokeWidth={1.8} />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">{item.price}</span>
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <Heart className="h-3 w-3" strokeWidth={1.8} />
                    <span>{item.likes + (likedItems.has(item.id) ? 1 : 0)}</span>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#F3E2C7] px-2 py-0.5 text-xs text-[#876934]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}