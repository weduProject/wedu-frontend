import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import ddayBgImage from '/src/assets/dday/background.jpg';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


interface DDayCardProps {
  targetDate: string | null;
  showEditButton?: boolean;
  readOnly?: boolean;
  onEditClick?: () => void;
}

export default function DDayCard({targetDate, showEditButton, readOnly=false, onEditClick }: DDayCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [timeLeft, setTimeLeft] = useState({
    dDayText: 'D-0',
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calculateTimeLeft() {
      if (!targetDate) return;

      const [year, month, day] = targetDate.split('-').map(Number);
      const targetDateObj = new Date(year, month - 1, day, 0, 0, 0); 
      const now = new Date();

      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const targetDay = new Date(targetDateObj.getFullYear(), targetDateObj.getMonth(), targetDateObj.getDate());

      const dayDiff = (targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

      let dDayText = '';
      if (dayDiff === 0) {
        dDayText = 'D-Day';
      } else if (dayDiff > 0) {
        dDayText = `D-${dayDiff}`;
      } else {
        dDayText = `D+${Math.abs(dayDiff)}`;
      }

      const difference = targetDateObj.getTime() - now.getTime();

      if (difference <= 0) {
        // 디데이가 오늘이거나 지났다면 타이머는 00:00:00으로 고정
        setTimeLeft({
          dDayText,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      } else {
        // 미래의 날짜라면 남은 시간 계산
        setTimeLeft({
          dDayText,
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const getFormattedToday = () => {
    const dateObj = new Date();
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${days[dateObj.getDay()]}요일)`;
  };

  const formattedTargetDate = targetDate ? targetDate.replace(/-/g, '. ') : '';

  if (!targetDate) {
    return (
      <div className="relative flex h-100 w-full flex-col items-center justify-center overflow-hidden rounded-4xl bg-gray-900 text-white shadow-xl md:h-120">
        <div 
        className="absolute inset-0 bg-cover bg-center opacity-60"
      >
        <img alt="배경 이미지" className="h-full w-full object-cover" src={ddayBgImage}></img>
      </div>
        <Calendar className="mx-auto mb-3 h-10 w-10" />
        <h3 className="mb-4 text-6xl font-bold">D-Day</h3>
        <p className="mb-4 text-sm text-center font-medium">
          결혼 날짜를 등록하고<br />남은 날을 확인해보세요
        </p>
        {!readOnly && (
          <button 
          onClick={() => {
            if (!user) {
                navigate('/login'); // 비회원이면 로그인으로
              } else if (onEditClick) {
                onEditClick(); // 회원이면 등록 모달 열기
              }
            }}
          className="flex items-center gap-2 rounded-full border border-white/40 bg-black/20 px-6 py-2.5 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
          >
          날짜 등록하기
        </button>
        )}
      </div>
    );
  }

return (
    <div className="relative flex h-100 w-full flex-col items-center justify-center overflow-hidden rounded-4xl bg-gray-900 text-white shadow-xl md:h-120">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-60"
      >
        <img alt="배경 이미지" className="h-full w-full object-cover" src={ddayBgImage}></img>
      </div>


      {/* 내부 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center">
        <p className="mb-4 text-sm font-light text-white/80 md:text-base">
          {getFormattedToday()}
        </p>
        
        <span className="mb-2 rounded-full bg-white/20 px-4 py-1 text-xs font-semibold tracking-wider backdrop-blur-md">
          WEDDING D-DAY
        </span>
        
        <h2 className="mb-2 text-6xl font-extrabold tracking-tighter md:text-8xl">
          {timeLeft.dDayText}
        </h2>
        
        <p className="mb-8 text-sm font-medium tracking-widest text-white/90 md:text-base">
          {formattedTargetDate}
        </p>

        {/* 타이머 */}
        <div className="mb-10 flex items-start text-3xl font-bold font-serif md:text-5xl">
          {[
            { label: '일', value: timeLeft.days },
            { label: '시간', value: timeLeft.hours },
            { label: '분', value: timeLeft.minutes },
            { label: '초', value: timeLeft.seconds },
          ].map((item, index, array) => (
            <div key={index} className="flex items-start">
              <div className="flex flex-col items-center">
                <span>{String(item.value).padStart(2, '0')}</span>
                <span className="mt-1 text-[11px] font-normal font-sans text-white/70 md:mt-2 md:text-sm">
                  {item.label}
                </span>
              </div>
              {index < array.length - 1 && (
                <span className="mx-2 mt-[-2px] text-white/50 md:mx-4 md:mt-0">:</span>
              )}
            </div>
          ))}
        </div>

        {/* 모달 띄우기 버튼 */}
        {!readOnly && showEditButton && (
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
