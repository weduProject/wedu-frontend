
import { Button } from '../../../components';
import type { ScheduleItem } from '../CalendarPage';
import ConfirmDeleteModal from '../../../components/ui/ConfirmDeleteModal';
import { useState } from 'react';

interface ScheduleDetailModalProps {
  schedules: ScheduleItem[];
  onClose: () => void;
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
}

export default function ScheduleDetailModal({ schedules, onClose, onEdit, onDelete }: ScheduleDetailModalProps) {
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

  const displayDate = schedules[0]?.date || '';
  const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
  const dateObj = displayDate ? new Date(displayDate) : null;
  const displayDay = dateObj ? DAYS[dateObj.getDay()] : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[80vh] w-full max-w-110 flex-col overflow-hidden animate-in zoom-in-95 fade-in duration-200 rounded-2xl bg-white p-6 shadow-xl">
        
        {/* 상단 헤더 영역 */}
        <div className="shrink-0 items-center border-b border-border p-6 pb-4">
          <h3 className="text-lg font-bold text-text">
            {displayDate} ({displayDay}) 일정
          </h3>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="relative rounded-xl border border-border bg-gray-50/50 p-5">
              
              {/* 개별 일정의 우측 상단 수정/삭제 버튼 */}
              <div className="absolute right-4 top-4 flex gap-3">
                <Button 
                  type="button"
                  onClick={() => onEdit(schedule)} 
                >
                  수정
                </Button>
                <Button
                  type="button"
                  variant='secondary'
                  onClick={() => setScheduleToDelete(schedule.id)}
                >
                  삭제
                </Button>
              </div>

              {/* 일정 세부 내용 */}
              <div className="flex flex-col gap-2 pr-20">
                <div className="flex flex-col gap-5 ">
                  <div>
                    <p className="text-xl font-semibold text-text">{schedule.title}</p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#968178]">시간</label>
                    <p className="text-sm text-text">{schedule.time}</p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-[#968178]">카테고리</label>
                    <p className="text-sm text-text">{schedule.category}</p>
                  </div>
                  <div>
                    <label className="mb-1.5 text-xs font-medium text-[#968178]">메모</label>
                    <p className="whitespace-pre-wrap text-sm text-text">{schedule.memo || '등록된 메모가 없습니다.'}</p>
                  </div>
                </div>
              </div>
              
            </div>

            
          ))}
        </div>

        {/* 하단 닫기 버튼 */}
        <div className="mt-8">
          <button 
            type="button" 
            onClick={onClose}
            className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50" 
          >
            닫기
          </button>
        </div>
        
      </div>
      <ConfirmDeleteModal
        isOpen={!!scheduleToDelete}
        onClose={() => setScheduleToDelete(null)}
        onConfirm={() => {
          if (scheduleToDelete) {
            onDelete(scheduleToDelete);
            setScheduleToDelete(null);
          }
        }}
      />
    </div>
  );
}