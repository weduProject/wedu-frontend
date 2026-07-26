import { useAuth } from '../../contexts/AuthContext';
import ChecklistSummaryCard from './components/ChecklistSummaryCard';
import QuickMenu from './components/QuickMenu';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSchedules } from '../Calendar/hooks/useSchedules';
import type { ScheduleItem } from '../Calendar/CalendarPage';
import UpcomingList from '../Calendar/components/UpcomingList';
import ScheduleDetailModal from '../Calendar/components/ScheduleDetailModal';
import DDayCard from './components/DDayCard';
import ScheduleModal from '../Calendar/components/ScheduleModal';
import BudgetSummaryCard from './components/BudgetSummaryCard';

export default function HomePage() {
  const { user } = useAuth();
  const userName = user?.name ?? 'OOO';
  const navigate = useNavigate();

  const [viewSchedule, setViewSchedule] = useState<ScheduleItem | null>(null);
  const [editSchedule, setEditSchedule] = useState<ScheduleItem | null>(null);

  const { schedules:rawSchedules, deleteSchedule, updateSchedule } = useSchedules();
  const schedules = user ? rawSchedules : [];

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
          <div
          onClick={() => navigate('/dday')}
          className="block transition-transform cursor-pointer hover:scale-[1.01]">
            <DDayCard targetDate="2026-11-18" weddingDateText="2026년 11월 18일" />
          </div>
          <div
          onClick={() => navigate('/budget')}
          className="block transition-transform cursor-pointer hover:scale-[1.01]">
            <BudgetSummaryCard />
          </div>
          <div
          onClick={() => navigate('/checklist')}
          className="block transition-transform cursor-pointer hover:scale-[1.01]">
            <ChecklistSummaryCard />
          </div>
        </div>
      </section>

      {/* 하단 다가오는 일정 & 빠른 메뉴 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 flex flex-col">
          <UpcomingList
            schedules={upcomingSchedules}
            onDelete={deleteSchedule}
            onScheduleClick={(schedule) => setViewSchedule(schedule)}
          />
        </div>
        <div className="md:col-span-2">
          {user && (
            <QuickMenu />
          )}
          
          {!user && (
            <>
          <section className="mb-6">
            <h2 className="mb-3 text-sm font-bold text-text-muted">둘러보기</h2>
            <div className="grid grid-cols-3 gap-3">
              
              <button
              onClick={() => navigate('/shop')}
              className="flex flex-col items-center justify-center cursor-pointer rounded-xl border border-border bg-white py-5 shadow-sm transition-colors hover:bg-primary-light/20">
                <span className="mb-2 text-2xl">💐</span> {/* 실제 서비스에선 SVG 아이콘으로 교체 */}
                <span className="text-xs font-semibold text-text">프로포즈 편집샵</span>
              </button>
              
              <button
              onClick={() => navigate('/builder-start')}
              className="flex flex-col items-center justify-center cursor-pointer rounded-xl border border-border bg-white py-5 shadow-sm transition-colors hover:bg-primary-light/20">
                <span className="mb-2 text-2xl">💍</span>
                <span className="text-xs font-semibold text-text">나만의 프로포즈</span>
              </button>
              
              <button
              onClick={() => navigate('/community')}
              className="flex flex-col items-center justify-center cursor-pointer rounded-xl border border-border bg-white py-5 shadow-sm transition-colors hover:bg-primary-light/20">
                <span className="mb-2 text-2xl">💬</span>
                <span className="text-xs font-semibold text-text">커뮤니티</span>
              </button>
              
            </div>
          </section>

          <button 
            onClick={() => navigate('/login')} 
            className="flex w-full items-center justify-between rounded-xl bg-[#F8F6F4] px-6 py-5 text-left transition-colors hover:bg-[#f0ece8]"
          >
            <div>
              <h4 className="text-sm font-bold text-text">나에게 맞는 프로포즈 찾기</h4>
              <p className="mt-1 text-xs text-text-muted">8개 질문에 답하면 취향에 맞는 프로포즈를 추천해드려요</p>
            </div>
            <span className="text-sm font-semibold text-primary">
              시작하기 &rarr;
            </span>
          </button>
          </>
          )}
          
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
