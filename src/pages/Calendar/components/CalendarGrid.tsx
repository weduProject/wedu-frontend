import BaseCard from '../../../components/ui/BaseCard';
import type { ScheduleItem } from '../CalendarPage';

interface CalendarGridProps {
  schedules: ScheduleItem[];
  onScheduleClick: (schedule: ScheduleItem) => void;
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarGrid({ schedules, onScheduleClick, year, month, onPrevMonth, onNextMonth }: CalendarGridProps) {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  const paddingDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const actualDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <BaseCard className="p-5 md:p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-center">
        <button onClick={onPrevMonth} className="text-text-muted hover:text-text cursor-pointer">&lt;</button>
        <h3 className="mx-8 text-lg font-bold text-text">
          {year}년 {month}월
        </h3>
        <button onClick={onNextMonth} className="text-text-muted hover:text-text cursor-pointer">&gt;</button>
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

          return (
            <div
              key={day}
              onClick={() => hasSchedule && onScheduleClick(schedulesForDay[0])}
              className="flex min-h-15 cursor-pointer flex-col items-center justify-start rounded-lg p-2 transition-colors hover:bg-primary-light/50 md:min-h-[80px]"
            >
              <span className="font-medium text-text">{day}</span>

              {hasSchedule && (
                <div className="mt-1 flex gap-1">
                  {schedulesForDay.map((_, idx) => (
                    <div
                      key={idx}
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