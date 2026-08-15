import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import avatar01 from '../../../assets/landing/testimonial-01.jpg';
import avatar02 from '../../../assets/landing/testimonial-02.jpg';
import avatar03 from '../../../assets/landing/testimonial-03.jpg';

interface Testimonial {
  text: string;
  name: string;
  role: string;
  rating: number;
  avatar: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    text: '심리테스트 결과가 너무 정확해서 놀랐어요. 남자친구랑 성향이 완전 다른 줄 알았는데, 테스트 결과를 보고 서로를 이해하는 계기가 되었습니다. 추천받은 호텔 패키지로 프로포즈했는데 완벽했어요!',
    name: '김지연 & 박민수',
    role: '2027년 3월 결혼 예정',
    rating: 4.9,
    avatar: avatar01,
  },
  {
    text: 'WEDU 덕분에 예산 관리가 정말 쉬워졌어요. 어느 항목에 얼마를 쓸지 감이 안 잡혔는데, 플랫폼에서 추천해준 예산 분배대로 하니까 스트레스 없이 준비할 수 있었습니다.',
    name: '이서연 & 최준혁',
    role: '2026년 12월 결혼 예정',
    rating: 4.8,
    avatar: avatar02,
  },
  {
    text: '체크리스트 기능이 최고예요. 할 일이 너무 많아서 정리가 안 됐는데, WEDU에서 제공하는 기본 체크리스트를 바탕으로 커스텀해서 사용하니까 하나도 빠짐없이 준비할 수 있었습니다.',
    name: '한채원 & 김도윤',
    role: '2026년 9월 결혼 예정',
    rating: 5.0,
    avatar: avatar03,
  },
];

const AUTO_SLIDE_INTERVAL_MS = 4000;

export default function TestimonialSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c === TESTIMONIALS.length - 1 ? 0 : c + 1));
    }, AUTO_SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const handleReviewClick = () => {
    if (user) {
      navigate('/community');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="bg-[#F1EEE7] py-20 md:py-28">
      <div className="w-full px-6 md:px-16">
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <h2 className="mb-10 text-3xl font-bold text-text md:text-4xl">( 실제 후기 )</h2>

          {/* 가로 슬라이드 영역 */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={handleReviewClick}
                  className="w-full shrink-0 cursor-pointer rounded-2xl border-0 bg-transparent p-0 text-left transition-opacity hover:opacity-90"
                >
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-text px-4 py-2">
                    <Star className="h-4 w-4 fill-primary text-primary" strokeWidth={1.8} />
                    <span className="text-sm font-medium text-white">{t.rating} / 5.0</span>
                  </div>

                  <blockquote className="mb-8 text-lg italic leading-relaxed text-text md:text-xl">
                    "{t.text}"
                  </blockquote>

                  <div className="flex items-center gap-4">
                    <img src={t.avatar} alt={t.name} className="h-12 w-12 shrink-0 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium text-text">{t.name}</p>
                      <p className="text-xs text-text-muted">{t.role}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 인디케이터 (중앙 정렬) */}
          <div className="mt-8 flex justify-center gap-1.5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                aria-label={`${i + 1}번째 후기로 이동`}
                className={
                  i === current
                    ? 'h-1.5 w-6 rounded-full bg-primary transition-all duration-300'
                    : 'h-1.5 w-1.5 rounded-full bg-[#D9C9C6] transition-all duration-300'
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}