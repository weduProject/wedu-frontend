
import { Button } from '../../../components';
import type { ScheduleItem } from '../CalendarPage';

interface ScheduleDetailModalProps {
  schedule: ScheduleItem;
  onClose: () => void;
  onEdit: () => void;
}

export default function ScheduleDetailModal({ schedule, onClose, onEdit }: ScheduleDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-110 animate-in zoom-in-95 fade-in duration-200 rounded-2xl bg-white p-6 shadow-xl">
        
        {/* 상단 헤더 영역 */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-text">일정 상세</h3>
          <Button
            type="button"
            onClick={onEdit}
          >
            수정
          </Button>
        </div>
        
        {/* 읽기 전용 데이터 렌더링 영역 */}
        <div className="flex flex-col gap-5">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#968178]">제목</label>
            <p className="text-sm font-semibold text-text">{schedule.title}</p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#968178]">날짜</label>
            <p className="text-sm text-text">{schedule.date}</p>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#968178]">시간</label>
            <p className="text-sm text-text">{schedule.time}</p>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-[#968178]">카테고리</label>
            <div>
              <span className="rounded-full border-0 px-4 py-2 text-sm font-medium bg-primary text-white">
                {schedule.category}
              </span>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#968178]">메모</label>
            <p className="whitespace-pre-wrap text-sm text-text">{schedule.memo || '등록된 메모가 없습니다.'}</p>
          </div>
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
    </div>
  );
}