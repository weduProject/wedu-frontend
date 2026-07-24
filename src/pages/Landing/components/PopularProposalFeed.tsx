import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';

// TODO: 백엔드 연동 시 GET /api/recommendations (또는 /api/recommend) 응답으로 교체
interface FeedItem {
  id: number;
  title: string;
  location: string;
  price: string;
  rating: number;
  reviewCount: number;
  category: '호텔' | '야외' | '파티룸' | '레스토랑' | '특별한 장소';
  tags: string[];
  image?: string;
}

const FEED_ITEMS: FeedItem[] = [
  {
    id: 1,
    title: '스카이뷰 호텔 럭셔리 페키지',
    location: '서울 강남구',
    price: '₩ 450,000',
    rating: 4.8,
    reviewCount: 234,
    category: '호텔',
    tags: ['호텔', '럭셔리'],
  },
  {
    id: 2,
    title: '가평 감성 정원 프로포즈',
    location: '경기 가평군',
    price: '₩ 280,000',
    rating: 4.7,
    reviewCount: 189,
    category: '야외',
    tags: ['야외', '감성'],
  },
  {
    id: 3,
    title: '이태원 루프탑 나이트 프로포즈',
    location: '서울 이태원',
    price: '₩ 350,000',
    rating: 4.9,
    reviewCount: 312,
    category: '특별한 장소',
    tags: ['파티룸', '나이트'],
  },
  {
    id: 4,
    title: '프라이빗 다이닝 페키지',
    location: '서울 청담동',
    price: '₩ 380,000',
    rating: 4.6,
    reviewCount: 156,
    category: '레스토랑',
    tags: ['레스토랑', '프라이빗'],
  },
  {
    id: 5,
    title: '한강 요트 프로포즈',
    location: '서울 여의도',
    price: '₩ 680,000',
    rating: 4.9,
    reviewCount: 278,
    category: '특별한 장소',
    tags: ['특별한 장소', '요트'],
  },
  {
    id: 6,
    title: '아트갤러리 모던 프로포즈',
    location: '서울 삼청동',
    price: '₩ 420,000',
    rating: 4.8,
    reviewCount: 198,
    category: '특별한 장소',
    tags: ['특별한 장소', '모던'],
  },
  {
    id: 7,
    title: '부산 해운대 선셋 프로포즈',
    location: '부산 해운대',
    price: '₩ 520,000',
    rating: 4.7,
    reviewCount: 445,
    category: '야외',
    tags: ['특별한 장소', '비치'],
  },
  {
    id: 8,
    title: '강원 스노우 마운틴 프로포즈',
    location: '강원 평창',
    price: '₩ 550,000',
    rating: 4.6,
    reviewCount: 367,
    category: '야외',
    tags: ['야외', '겨울'],
  },
];

const CATEGORIES = ['전체', '호텔', '야외', '파티룸', '레스토랑', '특별한 장소'] as const;

export default function PopularProposalFeed() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] =
    useState<(typeof CATEGORIES)[number]>('전체');

  const items =
    activeCategory === '전체'
      ? FEED_ITEMS
      : FEED_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section className="py-16 px-8 max-w-5xl mx-auto">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-text mb-1">인기 프로포즈 피드</h3>
          <p className="text-sm text-text-muted">
            지금 가장 인기 있는 프로포즈 스타일을 만나보세요
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline bg-transparent border-0 cursor-pointer"
        >
          전체 보기 →
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((category) => {
          const active = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={active}
              className={
                active
                  ? 'rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors'
                  : 'rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-[#594941] transition-colors hover:border-primary/40'
              }
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => navigate('/login')}
            className="group flex flex-col overflow-hidden rounded-xl bg-white text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative h-52 w-full bg-primary-light">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl">
                  💍
                </div>
              )}
              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm">
                <Heart
                  className="h-4 w-4 text-[#5C4840] transition-colors group-hover:fill-primary group-hover:text-primary"
                  strokeWidth={1.8}
                />
              </span>
            </div>

            <div className="flex flex-col gap-2 p-3">
              <div className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-light text-[10px] font-semibold text-primary">
                  W
                </span>
                <span className="text-xs text-text-muted">WEDU 큐레이터</span>
              </div>

              <h4 className="text-sm font-semibold text-text truncate">
                {item.title}
              </h4>

              <div className="flex items-center gap-1 text-xs text-[#938279]">
                <MapPin className="h-3 w-3" strokeWidth={1.8} />
                {item.location}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-primary">{item.price}~</span>
                <span className="flex items-center gap-1 text-xs text-[#938279]">
                  <Heart className="h-3 w-3" strokeWidth={1.8} fill="currentColor" />
                  {item.reviewCount}
                </span>
              </div>

              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#F3E2C7] px-2 py-0.5 text-[11px] text-[#876934]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}