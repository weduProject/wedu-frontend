import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, UserRound, Lightbulb, Heart, MessageCircle, Clock, LayoutGrid } from 'lucide-react';
import { apiFetch } from '../../lib/apiClient';
import img1 from '../../assets/magazine/1.png';
import img2 from '../../assets/magazine/2.png';
import img3 from '../../assets/magazine/3.png';
import img4 from '../../assets/magazine/4.png';
import img5 from '../../assets/magazine/5.png';
import img6 from '../../assets/magazine/6.png';
import img7 from '../../assets/magazine/7.png';
import img8 from '../../assets/magazine/8.png';
import img9 from '../../assets/magazine/9.png';
import img10 from '../../assets/magazine/10.png';
import heroImg from '../../assets/magazine/hero.png';

interface MagazinePost {
  id: string | number;
  communityId: number;
  title: string;
  content: string;
  category: '박람회' | '플래너' | '웨딩팁';
  imageUrl: string;
  likes: number;
  comments: number;
  date: string;
}

type CategoryKey = '전체' | '박람회' | '플래너' | '웨딩팁';

const CATEGORIES = ['전체', '박람회', '플래너', '웨딩팁'] as const;

const CATEGORY_META: Record<CategoryKey, { Icon: React.ElementType; color: string }> = {
  전체:   { Icon: LayoutGrid,  color: 'bg-pink-50 text-[#E8796C]' },
  박람회: { Icon: CalendarDays, color: 'bg-pink-50 text-[#E8796C]' },
  플래너: { Icon: UserRound,   color: 'bg-pink-50 text-[#E8796C]' },
  웨딩팁: { Icon: Lightbulb,   color: 'bg-pink-50 text-[#E8796C]' },
};

const DUMMY_POSTS: MagazinePost[] = [
  {
    id: 1,
    title: '예식장 계약 전 반드시 확인해야 할 숨은 비용 7가지',
    content: '누구나 하는 실수! 대관료만 보고 계약했다가 추가 비용 폭탄 맞는 경우 진짜 많아요. 1) 식대 외 부대시설 사용료 (주차장, 라운지 등) 2) 꽃 장식 추가 비용 — 기본 포함량이 생각보다 적음 3) 음향/조명...',
    communityId: 2, category: '웨딩팁', imageUrl: img1, likes: 256, comments: 51, date: '2026년 8월 3일',
  },
  {
    id: 2,
    title: '웨딩 플래너 고르는 5가지 체크리스트 — 후회 없는 선택법',
    content: '예비부부 80%가 웨딩플래너 선택을 가장 어려워한다는 설문 결과가 있어요. 당연하죠, 인생에서 가장 중요한 날을 누군가에게 맡기는 일이니까요. 오늘은 플래너 선택 전 꼭 확인해야 할 5가지를 정리했어요.',
    communityId: 6, category: '플래너', imageUrl: img2, likes: 215, comments: 42, date: '2026년 8월 2일',
  },
  {
    id: 3,
    title: '2026 COEX 하반기 웨딩페어 — 놓치면 후회할 혜택 총정리',
    content: '서울 삼성동 COEX에서 열리는 하반기 최대 규모 웨딩페어가 9월 15일부터 17일까지 진행됩니다. 웨딩홀, 스드메, 허니문, 예물까지 한 자리에서 비교해볼 수 있어요.',
    communityId: 10, category: '박람회', imageUrl: img3, likes: 128, comments: 24, date: '2026년 8월 1일',
  },
  {
    id: 4,
    title: '2026 웨딩 플래너 비용 완전 정복 — 평균 견적과 협상 팁',
    content: '웨딩플래너 비용, 막막하셨죠? 2026년 기준으로 정리해드릴게요. 당일 대행은 80~150만원, 부분 컨설팅은 150~300만원, 풀 컨설팅은 300~500만원 선이에요.',
    communityId: 3, category: '플래너', imageUrl: img4, likes: 187, comments: 35, date: '2026년 7월 30일',
  },
  {
    id: 5,
    title: '스드메 패키지 똑똑하게 고르는 법 — 따로 vs 묶음 비교',
    content: '스드메(스튜디오+드레스+메이크업)는 패키지로 한 번에 해결할지, 각각 따로 구하지가 항상 고민이죠. 2026년 기준으로 패키지 평균가와 따로 구했을 때를 비교해봤어요.',
    communityId: 3, category: '웨딩팁', imageUrl: img5, likes: 198, comments: 39, date: '2026년 7월 29일',
  },
  {
    id: 6,
    title: '신라호텔 웨딩 페어 2026 — 영빈관 투어 후기',
    content: '지난주 다녀온 신라호텔 웨딩페어 솔직 후기입니다. 영빈관 다이닝스티홀은 정말 압도적이었어요. 천장 높이도 엄청나고 조명 연출도 최고였어요.',
    communityId: 7, category: '박람회', imageUrl: img6, likes: 96, comments: 18, date: '2026년 7월 28일',
  },
  {
    id: 7,
    title: '허니문 시즌별 추천 여행지 총정리 (2026 하반기~2027)',
    content: '결혼 시즌별로 허니문 BEST 여행지를 정리해봤어요. 9~11월 가을: 이탈리아 토스카나, 체코 프라하, 일본 교토 (단풍 시즌 로망). 12월은 몰디브 추천해요.',
    communityId: 5, category: '웨딩팁', imageUrl: img7, likes: 173, comments: 33, date: '2026년 7월 27일',
  },
  {
    id: 8,
    title: '강남 vs 홍대 vs 종로 — 지역별 웨딩 플래너 스타일 비교',
    content: '재미있는 사실: 서울에서도 지역에 따라 웨딩플래너 스타일이 확 갈린다는 거 아시나요? 강남권 플래너는 럭셔리 호텔 웨딩 특화로 움직여요.',
    communityId: 6, category: '플래너', imageUrl: img8, likes: 142, comments: 28, date: '2026년 7월 26일',
  },
  {
    id: 9,
    title: '2026 부산 벡스코 웨딩 박람회 — 지역 예비부부 필수 코스',
    content: '부산 울산 경남 예비부부들 주목! 10월 6일부터 8일까지 벡스코에서 대규모 웨딩박람회 열립니다. 지역 웨딩홀 50여 곳, 스드메 업체들이 한자리에 모여요.',
    communityId: 10, category: '박람회', imageUrl: img9, likes: 73, comments: 11, date: '2026년 7월 25일',
  },
  {
    id: 10,
    title: '웨딩 예물 트렌드 2026 — 명품 시계부터 커스텀 주얼리까지',
    content: '2026년 예물 트렌드가 확 바뀌고 있어요. 전통적인 금+다이아 세트 대신 커플 시계(까르띠에 탱크, 롤렉스 데이트저스트)가 대세고, 커스텀 주얼리도 인기예요.',
    communityId: 9, category: '웨딩팁', imageUrl: img10, likes: 164, comments: 29, date: '2026년 7월 24일',
  },
];

function CategoryBadge({ category }: { category: CategoryKey }) {
  const { Icon, color } = CATEGORY_META[category];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" strokeWidth={2} />
      {category}
    </span>
  );
}

function PostMeta({ likes, comments, date }: { likes: number; comments: number; date: string }) {
  return (
    <div className="flex items-center gap-3 text-xs text-text-muted">
      <span className="flex items-center gap-1">
        <Heart className="w-3 h-3" strokeWidth={1.8} />
        {likes}
      </span>
      <span className="flex items-center gap-1">
        <MessageCircle className="w-3 h-3" strokeWidth={1.8} />
        {comments}
      </span>
      <span className="flex items-center gap-1 ml-auto">
        <Clock className="w-3 h-3" strokeWidth={1.8} />
        {date}
      </span>
    </div>
  );
}

export default function WeddingMagazinePage() {
  const [posts, setPosts] = useState<MagazinePost[]>(DUMMY_POSTS);
  const [activeCategory, setActiveCategory] = useState('전체');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await apiFetch('/api/magazine/posts');
        if (res.ok) {
          const body = await res.json();
          if (Array.isArray(body.data) && body.data.length > 0) setPosts(body.data);
        }
      } catch {
        // dummy fallback
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filtered = activeCategory === '전체'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const featuredPost = activeCategory === '전체' && filtered.length > 0 ? filtered[0] : null;
  const gridPosts = featuredPost ? filtered.slice(1) : filtered;

  function excerpt(content: string, max = 120) {
    return content.length <= max ? content : content.slice(0, max).replace(/\s+\S*$/, '') + '...';
  }

  return (
    <div className="-mx-5 md:-mx-8 -mt-5 md:-mt-8 -mb-5 md:-mb-8">
      {/* ── Hero (full bleed) ── */}
<section className="relative h-[658px] flex items-center justify-center overflow-hidden">
  <img src={heroImg} alt="매거진 히어로" className="absolute inset-0 w-full h-full object-cover" />
  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-black/30" />
  <div className="relative z-10 text-center px-6 max-w-2xl">
    <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/25 text-white/90 text-xs font-medium tracking-[0.2em] uppercase mb-6">
      Wedding Magazine
    </span>
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
      박람회 &amp; 플래너<br />웨딩 매거진
    </h1>
    <p className="mt-5 text-white/70 text-sm md:text-base leading-relaxed">
      믿을 수 있는 웨딩 박람회 일정부터 플래너 선택 꿀팁까지,
      <br className="hidden md:block" />
      예비부부를 위한 리얼 정보를 만나보세요.
    </p>
  </div>
</section>

      {/* ── Sticky category tabs (full bleed) ── */}
      <div className="sticky top-16 md:top-20 z-30 bg-white/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-5 md:px-8 flex items-center gap-2 py-3 overflow-x-auto">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive ? 'category-tab-active' : 'category-tab-inactive'
                }`}
              >
                {(() => { const { Icon } = CATEGORY_META[cat]; return <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />; })()}
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-5 md:px-8 py-8 md:py-10">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {!loading && (
          <>
            {/* Featured post */}
            {featuredPost && (
              <Link to={`/community/${featuredPost.communityId}`} className="group block mb-6 md:mb-8">
                <div className="rounded-2xl border border-border bg-white overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-5">
                    <div className="lg:col-span-3 relative h-60 lg:h-auto min-h-[260px] bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 overflow-hidden">
                      <img
                        src={featuredPost.imageUrl}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-4 left-4">
                        <CategoryBadge category={featuredPost.category} />
                      </div>
                    </div>
                    <div className="lg:col-span-2 p-6 md:p-8 lg:p-10 flex flex-col justify-center">
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-text leading-tight group-hover:text-primary transition-colors mb-3">
                        {featuredPost.title}
                      </h2>
                      <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-5">
                        {excerpt(featuredPost.content, 200)}
                      </p>
                      <PostMeta likes={featuredPost.likes} comments={featuredPost.comments} date={featuredPost.date} />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Card grid */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {gridPosts.map((post) => (
                  <Link key={post.id} to={`/community/${post.communityId}`} className="group block">
                    <div className="rounded-2xl border border-border bg-white overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
                      <div className="relative h-52 bg-gradient-to-br from-rose-100 via-pink-50 to-amber-50 flex-shrink-0 overflow-hidden">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute top-3 left-3">
                          <CategoryBadge category={post.category} />
                        </div>
                      </div>
                      <div className="p-4 md:p-5 flex flex-col flex-1">
                        <h3 className="text-sm md:text-base font-semibold text-text leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-text-muted leading-relaxed line-clamp-2 flex-1 mb-4">
                          {excerpt(post.content)}
                        </p>
                        <PostMeta likes={post.likes} comments={post.comments} date={post.date} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-20 text-text-muted text-sm">
                해당 카테고리에 아티클이 없어요.
              </div>
            )}
          </>
        )}
      </div>

      {/* ── CTA ── */}
      <div className="mx-auto max-w-5xl px-5 md:px-8 pb-8 md:pb-14">
        <div className="rounded-2xl bg-[#FAF8F4] border border-border px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-text mb-2">
              나만의 웨딩 플래너가 필요하신가요?
            </h2>
            <p className="text-sm text-text-muted">
              검증된 웨딩 파트너와 1:1 상담으로 완벽한 웨딩을 준비하세요.
            </p>
          </div>
          <Link
            to="/connect"
            className="whitespace-nowrap px-6 py-3 rounded-full text-sm font-semibold bg-primary text-white hover:opacity-90 transition-opacity"
          >
            파트너 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}
