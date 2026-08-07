import { useNavigate } from 'react-router-dom';

export default function ShopHero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#463730]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://readdy.ai/api/search-image?query=Romantic%20proposal%20planning%20workspace%20with%20soft%20warm%20cream%20and%20blush%20tones%2C%20elegant%20stationery%20and%20flower%20arrangement%20on%20marble%20desk%2C%20rose%20gold%20accessories%2C%20editorial%20flat%20lay%20photography%20with%20diffused%20natural%20light%2C%20sophisticated%20feminine%20aesthetic%2C%20minimal%20composition&width=1600&height=600&seq=propose-hero-v3&orientation=landscape')",
        }}
      />

      <div className="absolute inset-0 bg-linear-to-r from-black/50 via-black/30 to-black/20" />

      <div className="relative flex flex-col items-start px-14 py-20">
        <p className="mb-3 text-sm font-medium tracking-wide text-white/70">
          Proposal Studio
        </p>

        <h1 className="mb-4 text-5xl font-bold text-white">프로포즈 편집실</h1>

        <p className="mb-6 max-w-lg text-base leading-6 text-white/80">
          장소부터 선물, 특별한 경험까지. 당신의 완벽한 프로포즈를 위한 모든 것을
          둘러보세요.
        </p>

        <button
          type="button"
          onClick={() => navigate('/builder')}
          className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition-opacity hover:opacity-90"
        >
          나만의 프로포즈 만들기
          <span aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}
