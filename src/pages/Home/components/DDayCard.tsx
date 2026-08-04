import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../contexts/AuthContext';
import { Calendar } from 'lucide-react';

interface DDayCardProps {
  targetDate: string;
  showEditButton?: boolean; // 대시보드/상세페이지 구분
  onEditClick?: () => void;
}

export default function DDayCard({targetDate, showEditButton, onEditClick }: DDayCardProps) {
  // const navigate = useNavigate();
  // const { user } = useAuth();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calculateTimeLeft() {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) return;

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // "2026년 7월 26일 (일요일)" 형식 포맷팅
  const getFormattedToday = () => {
    const dateObj = new Date();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${days[dateObj.getDay()]}요일)`;
  };

  // "2026. 11. 18" 타겟 날짜 포맷팅
  const formattedTargetDate = targetDate.replace(/-/g, '. ');

  // if (!user) {
  //   return (
  //     <BaseCard className="flex h-full w-full text-white flex-col items-center justify-center rounded-2xl bg-[linear-gradient(to_right,#B76E79_0%,#D4A373_50%,#E8C4A2_100%)] p-6 md:p-8 border-0 text-center shadow-md">
  //       <Calendar className="mx-auto mb-3 h-10 w-10 opacity-90" />
  //       <h3 className="mb-2 text-2xl font-bold">D-Day</h3>
  //       <p className="mb-4 text-sm font-medium opacity-90">
  //         결혼 날짜를 등록하고<br />남은 날을 확인해보세요
  //       </p>
  //       <button 
  //         onClick={(e) => {
  //           e.stopPropagation();
  //           navigate('/login')}}
  //         className="rounded-full bg-white/20 px-6 py-2 text-sm font-bold backdrop-blur-sm transition-colors hover:bg-white/30"
  //       >
  //         날짜 등록하기
  //       </button>
  //     </BaseCard>
  //   );
  // }

return (
    <div className="relative flex h-[400px] w-full flex-col items-center justify-center overflow-hidden rounded-[32px] bg-gray-900 text-white shadow-xl md:h-[480px]">
      {/* 배경 이미지 설정 (현재는 임시 URL이며, assets 이미지로 교체하시면 됩니다) */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop')" }}
      ></div>

      {/* 내부 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center">
        <p className="mb-4 text-sm font-light text-white/80 md:text-base">
          {getFormattedToday()}
        </p>
        
        <span className="mb-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold tracking-wider backdrop-blur-md">
          WEDDING D-DAY
        </span>
        
        <h2 className="mb-2 text-6xl font-extrabold tracking-tighter md:text-8xl">
          D-{timeLeft.days}
        </h2>
        
        <p className="mb-8 text-sm font-medium tracking-widest text-white/90 md:text-base">
          {formattedTargetDate}
        </p>

        {/* 타이머 */}
        <div className="mb-10 flex items-start text-3xl font-bold md:text-5xl">
          {[
            { label: '일', value: timeLeft.days },
            { label: '시간', value: timeLeft.hours },
            { label: '분', value: timeLeft.minutes },
            { label: '초', value: timeLeft.seconds },
          ].map((item, index, array) => (
            <div key={index} className="flex items-start">
              <div className="flex flex-col items-center">
                <span>{String(item.value).padStart(2, '0')}</span>
                <span className="mt-1 text-[11px] font-normal text-white/70 md:mt-2 md:text-sm">
                  {item.label}
                </span>
              </div>
              {/* 마지막 항목 제외하고 콜론(:) 추가 */}
              {index < array.length - 1 && (
                <span className="mx-2 mt-[-2px] text-white/50 md:mx-4 md:mt-0">:</span>
              )}
            </div>
          ))}
        </div>

        {/* 모달 띄우기 버튼 */}
        {showEditButton && (
          <button 
            onClick={onEditClick}
            className="flex items-center gap-2 rounded-full border border-white/40 bg-black/20 px-6 py-2.5 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
          >
            <Calendar size={16} />
            날짜 수정하기
          </button>
        )}
      </div>
    </div>
  );
}
