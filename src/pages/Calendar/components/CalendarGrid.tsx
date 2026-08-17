import BaseCard from '../../../components/ui/BaseCard';
import type { ScheduleItem } from '../CalendarPage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarGridProps {
  schedules: ScheduleItem[];
  onScheduleClick: (schedules: ScheduleItem[]) => void;
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarGrid({ schedules, onScheduleClick, year, month, onPrevMonth, onNextMonth }: CalendarGridProps) {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  const realToday = new Date();
  const todayYear = realToday.getFullYear();
  const todayMonth = realToday.getMonth() + 1;
  const todayDate = realToday.getDate();
  
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const actualDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <BaseCard className="p-5 md:p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-center">
        <button 
          onClick={onPrevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text cursor-pointer transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="mx-8 text-lg font-bold font-serif text-text">
          {year}년 {month}월
        </h3>
        <button 
          onClick={onNextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text cursor-pointer transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {daysOfWeek.map((day) => (
          <div key={day} className="pb-2 font-semibold text-text-muted">
            {day}
          </div>
        ))}

        {paddingDays.map((_, index) => (
          <div key={`padding-${index}`} className="p-2"></div>
        ))}

        {actualDays.map((day) => {
          const formattedMonth = String(month).padStart(2, '0');
          const formattedDay = String(day).padStart(2, '0');
          const targetDateStr = `${year}-${formattedMonth}-${formattedDay}`;

          const schedulesForDay = schedules.filter((s) => s.date === targetDateStr);
          const hasSchedule = schedulesForDay.length > 0;

          const isToday = year === todayYear && month === todayMonth && day === todayDate;

          return (
            <div
              key={day}
              onClick={() => hasSchedule && onScheduleClick(schedulesForDay)}
              className={
                isToday
                ? "flex min-h-15 cursor-pointer flex-col items-center justify-start rounded-lg p-2 bg-primary/20 transition-colors hover:bg-primary/30 border-2 border-primary/70 md:min-h-20"
                : "flex min-h-15 cursor-pointer flex-col items-center justify-start rounded-lg p-2 transition-colors hover:bg-primary-light/50 md:min-h-20"}
            >
              <span className={"font-medium text-text"}>{day}</span>

              {hasSchedule && (
                <div className="mt-1 flex gap-1">
                  {schedulesForDay.map((schedule, idx) => (
                    <div
                      key={schedule.id}
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