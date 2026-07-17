import { useNavigate } from "react-router-dom";
export default function ShopCTA() {
    const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center rounded-3xl bg-gradient-to-r from-[#C36978] to-[#DDA06B] px-12 py-12 text-center">
      <h2 className="mb-3 text-3xl font-bold text-white">
        원하는 게 없으신가요?
      </h2>

      <p className="mb-6 max-w-md text-sm text-white/80">
        장소, 분위기, 음식, 예산까지 단계별로 선택하는 나만의 프로포즈 플래너로
        완벽한 프로포즈를 직접 설계해보세요.
      </p>

      <button
        type="button"
        onClick={() => navigate('/builder')}
        className="flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[#FC4A4D] transition-opacity hover:opacity-90"
      >
        나만의 프로포즈 시작하기
        <span aria-hidden>→</span>
      </button>
    </section>
  );
}