import BaseCard from '../../../components/ui/BaseCard';
import type { ScheduleItem } from '../CalendarPage';

interface CalendarGridProps {
  schedules: ScheduleItem[];
  onScheduleClick: (schedule: ScheduleItem) => void;
}

export default function CalendarGrid({ schedules, onScheduleClick }: CalendarGridProps) {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  // 임시 UI 확인용 (1~31일까지 배열 생성)
  const tempDays = Array.from({ length: 31 }, (_, i) => i + 1); 

  return (
    <BaseCard className="p-5 md:p-6 shadow-sm">
      {/* 달력 헤더 (월 이동) */}
      <div className="mb-6 flex items-center justify-center">
        <button className="text-text-muted hover:text-text cursor-pointer">&lt;</button>
        <h3 className="mx-8 text-lg font-bold text-text">2026년 7월</h3>
        <button className="text-text-muted hover:text-text cursor-pointer">&gt;</button>
      </div>

      {/* 달력 그리드 */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {/* 요일 */}
        {daysOfWeek.map((day) => (
          <div key={day} className="pb-2 font-semibold text-text-muted">
            {day}
          </div>
        ))}
        
        {/* 임시 빈 칸 (7월 1일이 수요일이라고 가정) */}
        <div className="p-2"></div>
        <div className="p-2"></div>
        <div className="p-2"></div>

        {/* 날짜 렌더링 */}
        {tempDays.map((day) => {
          // 해당 날짜에 일정이 있는지 체크
          const scheduleForDay = schedules.find(s => parseInt(s.date.split('-')[2]) === day);

          return (
            <div 
              key={day} 
              onClick={() => scheduleForDay && onScheduleClick(scheduleForDay)}
              className="flex min-h-15 cursor-pointer flex-col items-center justify-start rounded-lg p-2 transition-colors hover:bg-primary-light/50 md:min-h-[80px]"
            >
              <span className="font-medium text-text">{day}</span>
              
              {/* 일정이 있을 경우 시안처럼 하단에 점 표시 */}
              {scheduleForDay && (
                <div className="mt-1 flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-300"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </BaseCard>
  );
}