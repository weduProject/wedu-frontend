import { Link } from 'react-router-dom';
import { HeartPulse, MapPin, Sparkles, Wallet, ArrowRight } from 'lucide-react';

const FEATURES = [
  { Icon: HeartPulse, title: '심리테스트', desc: '성향 분석으로 찾는\n맞춤형 프로포즈 스타일', link: '/onboarding' },
  { Icon: MapPin, title: '장소 탐색', desc: '호텔, 야외, 파티룸 등\n다양한 장소를 비교해보세요', link: '/shop' },
  { Icon: Sparkles, title: '분위기 선택', desc: '로맨틱, 감성적, 화려한\n원하는 분위기를 설정하세요', link: '/builder-start' },
  { Icon: Wallet, title: '예산 관리', desc: '스마트한 예산 설정으로\n효율적인 웨딩 준비', link: '/budget' },
];

export default function FeatureSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="w-full px-6 md:px-16">
        <div className="mb-16 text-center">
          <div className="mb-8 mx-auto flex h-40 w-40 items-center justify-center md:h-52 md:w-52">
            <img
              src="https://public.readdy.ai/ai/img_res/0cbfc8af-0693-4c0f-9cdc-2b3ca35b8a0d.png"
              alt="WEDU"
              className="h-full w-full object-contain"
            />
          </div>
          <span className="mb-4 inline-block rounded-full border border-primary/40 px-4 py-1.5 text-xs font-medium text-primary">
            Our Services
          </span>
          <h2 className="mb-4 text-3xl font-bold text-text md:text-4xl lg:text-5xl">
            함께하는
            <br />
            특별한 웨딩 준비
          </h2>
          <p className="mx-auto max-w-xl text-base text-text-muted md:text-lg">
            심리테스트부터 예산 관리까지, 당신의 결혼 준비를 체계적으로 도와드립니다
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ Icon, title, desc, link }) => (
            <Link
              key={title}
              to={link}
              className="group rounded-xl border border-border bg-white p-6 no-underline transition-all duration-300 hover:border-primary/50 md:p-8"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light transition-colors group-hover:bg-primary/15">
                <Icon className="h-6 w-6 text-primary" strokeWidth={1.8} />
              </div>
              <h3 className="mb-2 whitespace-pre-line text-lg font-bold leading-snug text-text md:text-xl">
                {title}
              </h3>
              <p className="mb-4 whitespace-pre-line text-sm leading-relaxed text-text-muted">{desc}</p>
              <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                <span>자세히 보기</span>
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}