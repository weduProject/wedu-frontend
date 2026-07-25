import { useState, useEffect } from 'react';
import BaseCard from '../../../components/ui/BaseCard';

interface DDayCardProps {
  targetDate: string;
  weddingDateText: string;
  showEditButton?: boolean; // 대시보드/상세페이지 구분
  onEditClick?: () => void;
}

export default function DDayCard({targetDate, weddingDateText, showEditButton, onEditClick }: DDayCardProps) {
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

  const todayString = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <BaseCard className="w-full text-white bg-[linear-gradient(to_right,#B76E79_0%,#D4A373_50%,#E8C4A2_100%)] p-6 md:p-8 border-0 shadow-md">
      <div className="text-center mb-6">
        <p className="text-xs opacity-90 md:text-sm">{todayString}</p>
        <h2 className="text-4xl font-bold my-2 md:text-5xl md:my-3">D-{timeLeft.days}</h2>
        <p className="text-xs opacity-95 md:text-sm">{weddingDateText}</p>
      </div>
      
      <div className="flex justify-center gap-3 md:gap-4 text-white">
        {[
          { label: '일', value: timeLeft.days },
          { label: '시간', value: timeLeft.hours },
          { label: '분', value: timeLeft.minutes },
          { label: '초', value: timeLeft.seconds },
        ].map((item, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-xl py-2 w-16 md:w-20 md:py-3"
          >
            <span className="text-lg font-bold md:text-xl">
              {String(item.value).padStart(2, '0')}
            </span>
            <span className="text-[10px] text-white mt-0.5 md:text-xs">
              {item.label}
            </span>
          </div>
        ))}
      </div>
      {/* 상세 페이지에서만 렌더링되는 버튼 */}
      {showEditButton && (
        <div className="flex w-full justify-center">
          <button 
            onClick={onEditClick}
            className="w-fit mt-8 cursor-pointer rounded-lg bg-transparent px-5 py-2 text-sm font-medium text-white"
          >
            날짜 변경하기
          </button>
        </div>
        
      )}
    </BaseCard>
  );
}
