import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, UserRound, Lightbulb, Heart, MessageCircle, Clock, LayoutGrid } from 'lucide-react';
import { apiFetch } from '../../lib/apiClient';
import { DUMMY_POSTS } from './magazineData';
import BaseCard from '../../components/ui/BaseCard';
import type { MagazinePost } from './magazineData';
import heroImg from '../../assets/magazine/hero.jpg';

type CategoryKey = '전체' | '박람회' | '플래너' | '웨딩팁';

const CATEGORIES = ['전체', '박람회', '플래너', '웨딩팁'] as const;

const CATEGORY_META: Record<CategoryKey, { Icon: React.ElementType; color: string }> = {
  전체:   { Icon: LayoutGrid,  color: 'bg-pink-50 text-[#E8796C]' },
  박람회: { Icon: CalendarDays, color: 'bg-pink-50 text-[#E8796C]' },
  플래너: { Icon: UserRound,   color: 'bg-pink-50 text-[#E8796C]' },
  웨딩팁: { Icon: Lightbulb,   color: 'bg-pink-50 text-[#E8796C]' },
};

function CategoryBadge({ category }: { category: CategoryKey }) {
  return (
    <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-[#463730] backdrop-blur-sm">
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
      <section className="sticky top-16 z-30 border-b border-[#E7E4E3]/60 bg-[#FAF8F8]/80 backdrop-blur-[12px] md:top-20">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <div className="flex items-center gap-3 overflow-x-auto py-4 scrollbar-hide">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              const { Icon } = CATEGORY_META[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    document.getElementById('magazine-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`shrink-0 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    isActive ? 'category-tab-active' : 'category-tab-inactive'
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div id="magazine-content" className="max-w-5xl mx-auto px-5 md:px-8 py-8 md:py-10 scroll-mt-[130px] md:scroll-mt-[150px]">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}

        {!loading && (
          <>
            {/* Featured post */}
            {featuredPost && (
              <Link
                to={`/magazine/${featuredPost.id}`}
                className="group block mb-6 md:mb-8"
              >
                <BaseCard className="!p-0 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300">
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
                </BaseCard>
              </Link>
            )}

            {/* Card grid */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {gridPosts.map((post) => (
                  <Link key={post.id} to={`/magazine/${post.id}`} className="group block h-full">
                    <BaseCard className="!p-0 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
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
                    </BaseCard>
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
            className="btn-primary whitespace-nowrap"
          >
            파트너 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}
