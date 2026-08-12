import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../../../components/ui/Button'; 
import ctaCouple from '../../../assets/landing/cta-couple.jpg';

export default function CtaSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white">
      <div className="flex min-h-[500px] flex-col md:flex-row">
        <div className="relative min-h-[280px] w-full md:min-h-full md:w-1/2">
          <img
            src={ctaCouple}
            alt="Wedding couple"
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="mb-2 text-xs text-white/80">WEDU Special</p>
            <h3 className="text-3xl font-bold leading-tight text-white md:text-4xl">
              당신의 사랑을
              <br />
              가장 아름답게
            </h3>
          </div>
        </div>

        <div className="flex w-full items-center justify-center bg-white p-8 md:w-1/2 md:p-16">
          <div className="max-w-md text-center">
            <h2 className="mb-4 text-3xl font-bold leading-tight text-text md:text-4xl">
              지금 시작하는
              <br />
              당신만의 프로포즈
            </h2>
            <p className="mb-8 text-base leading-relaxed text-text-muted">
              심리테스트로 성향을 분석하고, 4단계 맞춤 플래닝으로 완벽한 프로포즈를 준비하세요.
            </p>
            <Button
              variant="main"
              size="lg"
              onClick={() => navigate('/onboarding')}
              className="inline-flex items-center gap-2"
            >
              무료로 시작하기
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}