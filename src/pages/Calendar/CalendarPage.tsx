import { useState } from 'react';
import CalendarFilter from './components/CalendarFilter.tsx';
import CalendarGrid from './components/CalendarGrid.tsx';
import UpcomingList from './components/UpcomingList.tsx';
import ScheduleModal from './components/ScheduleModal';
import { useSchedules } from './hooks/useSchedules.tsx';
import ScheduleDetailModal from './components/ScheduleDetailModal.tsx';
import { Button } from '../../components/index.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import EmptyState from '../../components/ui/EmptyState.tsx';


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
  const [viewSchedules, setViewSchedules] = useState<ScheduleItem[] | null>(null);
  const [editSchedule, setEditSchedule] = useState<ScheduleItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddModalOpen = () => {
        if (!user) {
        navigate('/login');
        return;
        }
        setIsAddModalOpen(true)
      }

  const { schedules: rawSchedules, addSchedule, deleteSchedule, updateSchedule, year, month, goToPrevMonth, goToNextMonth } = useSchedules();

  const schedules = user ? rawSchedules : [];

  // 필터링 로직
  const filteredSchedules = schedules.filter((item) => {
    return activeCategory === '전체' || item.category === activeCategory;
  })
  .sort((a,b) => {
    const datetimeA = new Date(`${a.date}T${a.time}`).getTime();
    const datetimeB = new Date(`${b.date}T${b.time}`).getTime();
    return datetimeA - datetimeB; // 시간순 정렬
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-serif text-text md:text-3xl">일정 관리</h2>
          <p className="mt-2 text-sm text-text-muted">웨딩 준비 일정을 한눈에 확인하고 관리하세요.</p>
        </div>
        <Button
          onClick={handleAddModalOpen}
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

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3 pb-6">
        <div className="lg:col-span-2">
          <CalendarGrid
            schedules={filteredSchedules}
            onScheduleClick={(schedules) => setViewSchedules(schedules)}
            year={year}
            month={month}
            onPrevMonth={goToPrevMonth}
            onNextMonth={goToNextMonth}
          />
        </div>
        <div className='h-full'>
          <UpcomingList
          schedules={filteredSchedules}
          onScheduleClick={(schedules) => setViewSchedules([schedules])}
          />
        </div>
      </div>

      {/* 비회원일 때 보여줄 빈 화면 멘트 */}
        {!user && (
          <EmptyState
            icon={Calendar}
            title="나의 일정을 관리하세요"
            description="로그인 후 카테고리별 일정을 관리하고 다가오는 일정을 확인할 수 있습니다."
          />
        )}

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
      {viewSchedules && viewSchedules.length > 0 && (
        <ScheduleDetailModal
          schedules={viewSchedules}
          onClose={() => setViewSchedules(null)}
          onEdit={(scheduleToEdit) => {
            setEditSchedule(scheduleToEdit); 
            setViewSchedules(null); 
          }}
          onDelete={(id) => {
            deleteSchedule(id); 
            
            setViewSchedules((prev) => {
              if (!prev) return null;
              const remainingSchedules = prev.filter((s) => s.id !== id);
              
              return remainingSchedules.length > 0 ? remainingSchedules : null;
            });
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