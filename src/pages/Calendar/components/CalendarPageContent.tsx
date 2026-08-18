// src/pages/Calendar/components/CalendarPageContent.tsx
import { useState, type ReactNode } from 'react';
import CalendarFilter from './CalendarFilter.tsx';
import CalendarGrid from './CalendarGrid.tsx';
import UpcomingList from './UpcomingList.tsx';
import type { ScheduleItem } from '../CalendarPage';

interface CalendarPageContentProps {
  schedules: ScheduleItem[];
  year: number;
  month: number;
  fallbackUI?: ReactNode;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onViewSchedules: (schedules: ScheduleItem[]) => void;
}

export default function CalendarPageContent({
  schedules, year, month, fallbackUI, onPrevMonth, onNextMonth, onViewSchedules
}: CalendarPageContentProps) {
  const [activeCategory, setActiveCategory] = useState('전체');

  const filteredSchedules = schedules.filter((item) => {
    return activeCategory === '전체' || item.category === activeCategory;
  }).sort((a,b) => {
    const datetimeA = new Date(`${a.date}T${a.time}`).getTime();
    const datetimeB = new Date(`${b.date}T${b.time}`).getTime();
    return datetimeA - datetimeB; 
  });

  return (
    <div>
      <div className="mt-6">
        <CalendarFilter activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CalendarGrid
            schedules={filteredSchedules}
            onScheduleClick={onViewSchedules}
            year={year}
            month={month}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
          />
        </div>
        <div className='h-full'>
          <UpcomingList
            schedules={filteredSchedules}
            onScheduleClick={(schedule) => onViewSchedules([schedule])}
          />
        </div>
      </div>
      
      {fallbackUI}
    </div>
  );
}