import BaseCard from '../../../components/ui/BaseCard';
import type { ScheduleItem } from '../CalendarPage';

interface UpcomingListProps {
  schedules: ScheduleItem[];
  onDelete?: (id: string) => void;
  onScheduleClick?: (schedule: ScheduleItem) => void;
}

export default function UpcomingList({ schedules, onScheduleClick, onDelete }: UpcomingListProps) {
  return (
    <BaseCard className="p-5 md:p-6 shadow-sm h-full">
      <h3 className="mb-4 text-base font-bold text-text">다가오는 일정</h3>

      <div className="flex flex-col gap-3">
        {schedules.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#968178]">예정된 일정이 없습니다.</p>
        ) : (
          schedules.map((item) => (
            <div
              key={item.id}
              onClick={() => onScheduleClick && onScheduleClick(item)}
              className="flex items-center gap-4 rounded-xl border border-border p-3 hover:bg-primary-light/30 transition-colors group"
            >
              <div className="flex min-w-12.5 shrink-0 flex-col items-center justify-center rounded-lg bg-primary-light p-2 text-primary">
                <span className="text-[10px] font-semibold uppercase">{item.date.split('-')[1]}월</span>
                <span className="mt-0.5 text-lg font-bold leading-none">{item.date.split('-')[2]}</span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-text">{item.title}</p>
                <p className="mt-0.5 text-xs text-[#968178]">{item.time}</p>
              </div>

              {/* 삭제 버튼: 평소엔 흐릿하게, hover 시 진하게 (항상 클릭 가능) */}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // 삭제 버튼 누를 때 상세 모달까지 열리는 것 방지
                    onDelete(item.id);
                  }}
                  className="shrink-0 rounded-md p-2 text-xs text-red-400 opacity-70 transition-opacity hover:text-red-600 group-hover:opacity-100 cursor-pointer"
                >
                  삭제
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </BaseCard>
  );
}