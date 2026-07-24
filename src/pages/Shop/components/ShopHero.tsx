import { useNavigate } from 'react-router-dom';

export default function ShopHero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#463730]">
      {/* TODO: 배경 이미지 들어오면 여기 교체 */}
      <div className="absolute inset-0 bg-[#463730]" />

      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/20" />

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
