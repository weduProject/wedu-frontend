import { useState } from 'react';
import CalendarFilter from './components/CalendarFilter.tsx';
import CalendarGrid from './components/CalendarGrid.tsx';
import UpcomingList from './components/UpcomingList.tsx';
import ScheduleModal from './components/ScheduleModal';
import { useSchedules } from './hooks/useSchedules.tsx';
import ScheduleDetailModal from './components/ScheduleDetailModal.tsx';
import { Button } from '../../components/index.ts';

export type CategoryType = '웨딩홀/예식장' | '스튜디오/드레스' | '허니문' | '예물/예단' | '기타';

export interface ScheduleItem {
  id: string;
  title: string;
  date: string;
  time: string;
  category: CategoryType;
  memo?: string;
}

export default function CalendarPage() {
  const [activeCategory, setActiveCategory] = useState('전체');

  // 상태 분리: 상세보기용 데이터 vs 수정용 데이터
  const [viewSchedule, setViewSchedule] = useState<ScheduleItem | null>(null);
  const [editSchedule, setEditSchedule] = useState<ScheduleItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { schedules, addSchedule, deleteSchedule, updateSchedule } = useSchedules();

  // 필터링 로직
  const filteredSchedules = schedules.filter((item) => {
    return activeCategory === '전체' || item.category === activeCategory;
  });

  return (
    <div className="mx-auto max-w-[1024px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text md:text-3xl">일정 관리</h2>
          <p className="mt-2 text-sm text-text-muted">웨딩 준비 일정을 한눈에 확인하고 관리하세요.</p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/95"
        >
          + 일정 추가
        </Button>
      </div>

      <div className="mt-6">
        <CalendarFilter 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CalendarGrid
          schedules={filteredSchedules}
          onScheduleClick={(schedule) => setViewSchedule(schedule)}
           />
        </div>
        <div>
          <UpcomingList
          schedules={filteredSchedules}
          onDelete={deleteSchedule}
          onScheduleClick={(schedule) => setViewSchedule(schedule)}
          />
        </div>
      </div>

      {/* 1. 새 일정 추가 모달 (isAddModalOpen이 true일 때 뜸) */}
      {isAddModalOpen && (
        <ScheduleModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(newData) => {
            addSchedule(newData);
            setIsAddModalOpen(false);
          }}
        />
      )}

      {/* 2. 일정 상세 보기 모달 (viewSchedule에 데이터가 있을 때 뜸) */}
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

      {/* 3. 일정 수정 모달 (editSchedule에 데이터가 있을 때 뜸) */}
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
    </div>
  );
}