import { useState } from 'react';
import BaseCard from '../../../components/ui/BaseCard';
import type { ScheduleItem } from '../CalendarPage';

interface CalendarGridProps {
  schedules: ScheduleItem[];
  onScheduleClick: (schedule: ScheduleItem) => void;
}

export default function CalendarGrid({ schedules, onScheduleClick }: CalendarGridProps) {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  const [currentDate, setCurrentDate] = useState(new Date());
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // 1. 이번 달 1일이 무슨 요일인지 계산 (0: 일요일 ~ 6: 토요일)
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
  // 2. 이번 달이 총 며칠까지 있는지 계산 (0을 넣으면 이전 달의 마지막 날, 즉 이번 달의 끝 날짜가 나옴)
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  // 3. UI에 그릴 배열 생성
  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i); // 앞쪽 빈 칸
  const actualDays = Array.from({ length: daysInMonth }, (_, i) => i + 1); // 실제 날짜 (1 ~ 끝)

  return (
    <BaseCard className="p-5 md:p-6 shadow-sm">
      {/* 달력 헤더 (월 이동) */}
      <div className="mb-6 flex items-center justify-center">
        <button
        onClick={handlePrevMonth}
        className="text-text-muted hover:text-text cursor-pointer">&lt;</button>
        <h3 className="mx-8 text-lg font-bold text-text">
          {currentYear}년 {currentMonth}월
        </h3>
        <button
        onClick={handleNextMonth}
        className="text-text-muted hover:text-text cursor-pointer">&gt;</button>
      </div>

      {/* 달력 그리드 */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {/* 요일 */}
        {daysOfWeek.map((day) => (
          <div key={day} className="pb-2 font-semibold text-text-muted">
            {day}
          </div>
        ))}
        
        {/* 1일 시작 전까지의 빈 칸 렌더링 */}
        {paddingDays.map((_, index) => (
          <div key={`padding-${index}`} className="p-2"></div>
        ))}

        {/* 날짜 렌더링 */}
        {actualDays.map((day) => {
          const formattedMonth = String(currentMonth).padStart(2, '0');
          const formattedDay = String(day).padStart(2, '0');
          const targetDateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

          // find 대신 filter를 써서 해당 날짜에 있는 모든 일정을 배열로 가져옴
          const schedulesForDay = schedules.filter(s => s.date === targetDateStr);
          const hasSchedule = schedulesForDay.length > 0;

          return (
            <div 
              key={day} 
              onClick={() => hasSchedule && onScheduleClick(schedulesForDay[0])}
              className="flex min-h-15 cursor-pointer flex-col items-center justify-start rounded-lg p-2 transition-colors hover:bg-primary-light/50 md:min-h-[80px]"
            >
              <span className="font-medium text-text">{day}</span>
              
              {/* 일정이 있을 경우 하단에 점 표시 */}
              {hasSchedule && (
                <div className="mt-1 flex gap-1">
                  {schedulesForDay.map((_, idx) => (
                    <div 
                      key={idx} 
                      // 짝수/홀수 인덱스에 따라 점 색상을 다르게 줘서 시각적으로 분리
                      className={`h-1.5 w-1.5 rounded-full ${idx % 2 === 0 ? 'bg-primary' : 'bg-orange-300'}`}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </BaseCard>
  );
}