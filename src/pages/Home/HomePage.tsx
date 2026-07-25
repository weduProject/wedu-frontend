import { useAuth } from '../../contexts/AuthContext';
import BudgetCard from './components/BudgetCard';
import ChecklistSummaryCard from './components/ChecklistSummaryCard';
import QuickMenu from './components/QuickMenu';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSchedules } from '../Calendar/hooks/useSchedules';
import type { ScheduleItem } from '../Calendar/CalendarPage';
import UpcomingList from '../Calendar/components/UpcomingList';
import ScheduleDetailModal from '../Calendar/components/ScheduleDetailModal';
import DDayCard from './components/DDayCard';
import ScheduleModal from '../Calendar/components/ScheduleModal';

export default function HomePage() {
  const { user } = useAuth();
  const userName = user?.name ?? 'OOO';

  const [viewSchedule, setViewSchedule] = useState<ScheduleItem | null>(null);
  const [editSchedule, setEditSchedule] = useState<ScheduleItem | null>(null);

  const { schedules, deleteSchedule, updateSchedule } = useSchedules();

  // 다가오는 일정 3개만 필터링 및 정렬 (날짜가 빠른 순)
  const upcomingSchedules = schedules
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <main className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl font-bold">
          {user ? `안녕하세요, ${userName}님!` : '안녕하세요. 당신의 최고의 순간을 함께하는 WEDU입니다.'}
        </h1>
      </section>

      <section>
        <h2 className="mb-3 text-base text-text-muted">이번 달 준비 현황</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Link to="/dday" className="block transition-transform hover:scale-[1.01]">
            <DDayCard targetDate="2026-11-18" weddingDateText="2026년 11월 18일" />
          </Link>
          <BudgetCard />
          <Link to="/checklist" className="block transition-transform hover:scale-[1.01]">
            <ChecklistSummaryCard />
          </Link>
        </div>
      </section>

      {/* 하단 다가오는 일정 & 빠른 메뉴 영역 */}
      <div className="grid grid-cols-3 gap-4">
        
        <div className="col-span-1 flex flex-col">
          <UpcomingList 
            schedules={upcomingSchedules} 
            onDelete={deleteSchedule}
            onScheduleClick={(schedule) => setViewSchedule(schedule)} 
          />
          
        </div>

        <div className="col-span-2">
          <QuickMenu />
        </div>
      </div>

      {viewSchedule && (
        <ScheduleDetailModal
          schedule={viewSchedule}
          onClose={() => setViewSchedule(null)}
          onEdit={() => {
            setEditSchedule(viewSchedule); 
            setViewSchedule(null); 
          }}
        />
      )}

      {editSchedule && (
        <ScheduleModal
          initialData={editSchedule}
          onClose={() => setEditSchedule(null)}
          onSubmit={(updatedData) => {
            updateSchedule(editSchedule.id, updatedData);
            setEditSchedule(null);
          }}
        />
      )}
    </main>
  );
}
