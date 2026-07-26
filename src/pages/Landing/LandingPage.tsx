import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../Shop/shopData';

const FEATURES = [
  { emoji: '💍', label: '나만의 프로포즈', desc: '취향 맞춤 프로포즈 설계' },
  { emoji: '📋', label: '웨딩 준비', desc: '체크리스트 & 일정 관리' },
  { emoji: '💰', label: '예산 관리', desc: '스마트한 예산 계획' },
  { emoji: '🏨', label: '편집샵', desc: '엄선된 프로포즈 패키지' },
];

const STATS = [
  { value: '90%', label: '고객 만족도' },
  { value: '10,000+', label: '성사된 프로포즈' },
];

const REVIEWS = [
  {
    text: '덕분에 완벽한 프로포즈를 할 수 있었어요. 상대방이 너무 좋아했습니다. 강력 추천합니다!',
    author: '김*준',
    date: '2026.05.12',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const popularProducts = PRODUCTS.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">
      {/* 히어로 */}
      <section className="relative h-[560px] flex items-center bg-[#463730] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="relative px-12 md:px-24 max-w-2xl">
          <p className="text-sm text-white/70 mb-3 tracking-wide">당신의 특별한 순간</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
            당신만의 특별한 순간을<br />함께 준비하세요
          </h2>
          <p className="text-white/80 text-sm leading-relaxed mb-8">
            프로포즈부터 웨딩까지, WEDU가 당신의 가장 소중한 순간을 완성해 드립니다.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer border-0"
            >
              지금 시작하기
            </button>
            <button
              type="button"
              onClick={() => navigate('/home')}
              className="rounded-full bg-white/20 backdrop-blur-sm px-7 py-3 text-sm font-semibold text-white hover:bg-white/30 transition-colors cursor-pointer border-0"
            >
              비회원으로 둘러보기
            </button>
          </div>
        </div>
      </section>

      {/* 특징 */}
      <section className="py-16 px-8 max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold text-text text-center mb-2">WEDU와 함께하는 특별한 웨딩 준비</h3>
        <p className="text-sm text-[#7C6358] text-center mb-10">처음부터 끝까지, 당신의 소중한 순간을 함께합니다</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div key={f.label} className="flex flex-col items-center text-center p-6 rounded-2xl bg-primary-light">
              <span className="text-3xl mb-3">{f.emoji}</span>
              <p className="text-sm font-semibold text-text mb-1">{f.label}</p>
              <p className="text-xs text-[#7C6358]">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 인기 프로포즈 피드 */}
      <section className="py-16 px-8 bg-[#FAF8F4]">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-text">인기 프로포즈 피드</h3>
              <p className="text-sm text-[#7C6358] mt-1">많은 커플들이 선택한 프로포즈</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="text-sm text-primary hover:underline cursor-pointer bg-transparent border-0"
            >
              전체 보기 →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {popularProducts.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => navigate('/login')}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white text-left hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="h-40 w-full bg-primary-light flex items-center justify-center">
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-4xl">💍</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-text-muted mb-1">{product.category}</p>
                  <p className="text-sm font-semibold text-text mb-1">{product.title}</p>
                  <p className="text-sm font-bold text-primary">{product.price}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 통계 */}
      <section className="py-16 px-8 bg-gradient-to-r from-[#C36978] to-[#DDA06B]">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-2">수많은 커플이 WEDU를 통해<br />특별한 순간을 만들었습니다</h3>
          <p className="text-white/80 text-sm mb-10">당신도 WEDU와 함께 잊지 못할 순간을 만들어보세요</p>
          <div className="flex justify-center gap-12">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-sm text-white/80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 실제 후기 */}
      <section className="py-16 px-8 max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold text-text text-center mb-10">실제 후기</h3>
        <div className="flex flex-col gap-4 max-w-xl mx-auto">
          {REVIEWS.map((r, i) => (
            <div key={i} className="rounded-2xl border border-border bg-white p-6">
              <p className="text-sm text-[#5C4940] leading-relaxed mb-4">"{r.text}"</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text">{r.author}</span>
                <span className="text-xs text-text-muted">{r.date}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 px-8 bg-[#463730] text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />
        <div className="relative max-w-lg mx-auto">
          <h3 className="text-3xl font-bold text-white mb-3">지금 시작하는<br />당신만의 프로포즈</h3>
          <p className="text-white/80 text-sm mb-8">WEDU와 함께 잊지 못할 순간을 만들어보세요</p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer border-0"
          >
            당신의 사랑을 이동담기
          </button>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="bg-text px-8 py-10 text-text-muted text-xs">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-6">
          <div>
            <p className="text-white font-bold text-base mb-2">WEDU</p>
            <p>당신의 특별한 순간을 함께 준비합니다.</p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <p className="text-white font-semibold mb-1">서비스</p>
              <span>편집샵</span>
              <span>나만의 프로포즈</span>
              <span>커뮤니티</span>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-white font-semibold mb-1">고객센터</p>
              <span>이용약관</span>
              <span>개인정보처리방침</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
