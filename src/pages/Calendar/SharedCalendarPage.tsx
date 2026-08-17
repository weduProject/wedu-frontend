// src/pages/Calendar/SharedCalendarPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import { fromBackendEvent } from './utils/apiMapping';
import CalendarPageContent from './components/CalendarPageContent';
import ScheduleDetailModal from './components/ScheduleDetailModal';
import type { ScheduleItem } from './CalendarPage';

export default function SharedCalendarPage() {
  const { token } = useParams<{ token: string }>();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [viewSchedules, setViewSchedules] = useState<ScheduleItem[] | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    apiFetch(`/api/calendar-events/shared/${token}?year=${year}&month=${month}`)
      .then((res) => res.json())
      .then((body) => {
        const list = Array.isArray(body) ? body : (body.data || []);
        setSchedules(list.map(fromBackendEvent));
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [token, year, month]);

  const goToPrevMonth = () => {
    if (month === 1) { setYear((y) => y - 1); setMonth(12); }
    else { setMonth((m) => m - 1); }
  };

  const goToNextMonth = () => {
    if (month === 12) { setYear((y) => y + 1); setMonth(1); }
    else { setMonth((m) => m + 1); }
  };

  if (isLoading) return <p className="py-20 text-center text-sm text-text-muted">불러오는 중...</p>;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-serif text-text md:text-3xl">공유된 일정 관리</h2>
        <p className="mt-2 text-sm text-text-muted">조회 전용 캘린더 페이지입니다.</p>
      </div>

      <CalendarPageContent
        schedules={schedules}
        year={year}
        month={month}
        onPrevMonth={goToPrevMonth}
        onNextMonth={goToNextMonth}
        onViewSchedules={setViewSchedules}
      />

      {viewSchedules && viewSchedules.length > 0 && (
        <ScheduleDetailModal
          schedules={viewSchedules}
          readOnly={true}
          onClose={() => setViewSchedules(null)}
        />
      )}
    </div>
  );
}