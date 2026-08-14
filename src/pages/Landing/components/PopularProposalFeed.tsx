import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, ArrowRight } from 'lucide-react';
import { CATEGORY_TAB_ACTIVE, CATEGORY_TAB_INACTIVE } from '../../../styles/categoryTab';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchPopularProducts } from '../../Shop/shopApi';
import type { DisplayProduct } from '../../Shop/shopApi';
import { formatWon } from '../../Shop/utils/price';

const CATEGORY_FILTERS = ['전체', '주얼리', '이벤트/공간', '플라워', '사진/영상', '편지/레터', '기타'] as const;

export default function FeedSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<(typeof CATEGORY_FILTERS)[number]>('전체');
  const [likedItems, setLikedItems] = useState<Set<number>>(new Set());
  const [items, setItems] = useState<DisplayProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPopularProducts()
      .then(setItems)
      .catch((err) => console.warn('인기 상품 조회 실패', err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleItemClick = () => {
    navigate('/shop');
  };

  const filteredItems =
    activeCategory === '전체' ? items : items.filter((item) => item.categoryType === activeCategory);

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
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
          {CATEGORY_FILTERS.map((cat) => {
            const active = cat === activeCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                aria-pressed={active}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  active ? CATEGORY_TAB_ACTIVE : CATEGORY_TAB_INACTIVE
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-sm text-text-muted">불러오는 중...</p>
        ) : filteredItems.length === 0 ? (
          <p className="py-10 text-center text-sm text-text-muted">아직 등록된 인기 상품이 없어요.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4 lg:gap-6">
            {filteredItems.map((item) => (
              <button key={item.id} type="button" onClick={handleItemClick} className="group text-left">
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-primary-light">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
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
                    <span>{item.locationTag ?? item.vendorName}</span>
                  </div>
                  <div className="flex items-center justify-between pr-2">
                    <span className="text-sm font-semibold text-primary">{formatWon(item.price)}</span>
                    <div className="flex shrink-0 items-center gap-1 text-xs text-text-muted">
                      <Heart className="h-3 w-3" strokeWidth={1.8} />
                      <span>{likedItems.has(item.id) ? 1 : 0}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full bg-secondary-100 px-2 py-0.5 text-xs text-[#876934]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}