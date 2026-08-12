import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Header from '../../../components/layout/Header';
import Button from '../../../components/ui/Button';
import heroBg from '../../../assets/landing/hero-bg.jpg';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <Header />

      <div className="absolute inset-0 bg-[#463730]">
        <img
          src={heroBg}
          alt="Wedding hero"
          className="h-full w-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/30" />
      </div>

      <div className="relative z-10 w-full px-6 pt-20 md:px-16">
        <div className="max-w-4xl">
          <h1 className="mb-6 text-3xl font-bold leading-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl">
            당신만의
            <br />
            <span className="italic">특별한</span> 순간을
            <br />
            함께 준비하세요
          </h1>
          <div className="mt-8 flex flex-col gap-6 md:flex-row md:gap-12">
            <p className="max-w-sm text-base leading-relaxed text-white/90 drop-shadow-md md:text-lg">
              심리테스트로 찾는 나만의 프로포즈 스타일.
              <br />
              WEDU와 함께라면 결혼 준비도 설레는 여정이 됩니다.
            </p>
            <div className="flex flex-col gap-3 md:pt-2">
              <Button
                variant="main"
                size="md"
                onClick={() => navigate('/onboarding')}
                className="inline-flex w-fit items-center gap-2 px-6 py-3"
              >
                심리테스트 시작하기
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </Button>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="flex w-fit items-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                프로포즈 둘러보기
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}