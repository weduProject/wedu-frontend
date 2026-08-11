import { ArrowUpRight } from 'lucide-react';

export default function StatsSection() {
  return (
    <section className="bg-[#F1EEE7] py-20 md:py-28">
      <div className="w-full px-6 md:px-16">
        <div className="mb-12 md:mb-16">
          <span className="mb-3 block text-sm italic text-primary">About WEDU</span>
          <h2 className="text-3xl font-bold leading-tight text-text md:text-4xl lg:text-5xl">
            수많은 커플이
            <br />
            <span className="font-serif italic">WEDU</span>를 통해
            <br />
            특별한 순간을 만들었습니다
          </h2>
          <p className="mt-4 max-w-lg text-base text-text-muted">
            데이터 기반 매칭과 전문 큐레이션으로 최적의 프로포즈 경험을 제공합니다
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-white md:p-10">
            <div className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <ArrowUpRight className="h-5 w-5 text-white" strokeWidth={1.8} />
            </div>
            <div className="mb-4 text-5xl font-bold md:text-6xl">90%</div>
            <p className="mb-2 text-sm leading-relaxed text-white/80">
              심리테스트 매칭 정확도
              <br />
              커플 성향 분석 기반 최적의 스타일 추천
            </p>
            <p className="mt-8 text-xs italic text-white/60">Find your perfect match</p>
          </div>

          <div className="relative overflow-hidden rounded-2xl bg-white/60 p-8 md:p-10">
            <div className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/60">
              <ArrowUpRight className="h-5 w-5 text-text" strokeWidth={1.8} />
            </div>
            <div className="mb-4 text-5xl font-bold text-text md:text-6xl">10,000+</div>
            <p className="text-sm leading-relaxed text-[#594941]">
              누적 프로포즈 플랜 생성 수
              <br />
              다양한 커플의 특별한 순간을 함께했습니다.
              <br />
              매일 새로운 스타일과 장소가 업데이트됩니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}