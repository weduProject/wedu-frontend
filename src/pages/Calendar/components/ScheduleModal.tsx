import { useState } from 'react';
import type { CategoryType, ScheduleItem } from '../CalendarPage';

// 공용 UI 컴포넌트 임포트
import Button from '../../../components/ui/Button';
import TextField from '../../../components/ui/TextField';
import clsx from 'clsx';

interface ScheduleModalProps {
  // 선택적 프롭스: 이게 있으면 수정(Edit) 모드, 없으면 생성(Create) 모드
  initialData?: ScheduleItem | null; 
  onClose: () => void;
  onSubmit: (schedule: Omit<ScheduleItem, 'id'>) => void;
}

const CATEGORIES: CategoryType[] = ['웨딩홀/예식장', '스튜디오/드레스', '허니문', '예물/예단', '기타'];

export default function ScheduleModal({ initialData, onClose, onSubmit }: ScheduleModalProps) {
  // initialData가 있으면 해당 값으로, 없으면 빈 값으로 초기화
  const [form, setForm] = useState({
    title: initialData?.title || '',
    date: initialData?.date || '',
    // time이 빈 문자열이면 split 시 에러가 날 수 있으므로 기본값을 '00:00'으로 설정
    time: initialData?.time || '00:00', 
    category: initialData?.category || '웨딩홀/예식장' as CategoryType,
    memo: initialData?.memo || '',
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.date || !form.time) return;
    onSubmit(form);
  }

  const isEditMode = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-110 animate-in zoom-in-95 fade-in duration-200 rounded-2xl bg-white p-6 shadow-xl">
        
        <h3 className="text-base font-bold text-text md:text-lg">
          {isEditMode ? '일정 수정' : '새 일정 추가'}
        </h3>
        
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {/* 제목 입력 */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#968178]">제목</label>
            <TextField
              placeholder="예: 드레스 피팅"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          {/* 날짜 */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#968178]">날짜</label>
            <TextField
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          {/* 시간 */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#968178]">시간</label>
            <div className="flex gap-2">
              <select 
                value={form.time.split(':')[0]} 
                onChange={(e) => setForm({ ...form, time: `${e.target.value}:${form.time.split(':')[1] || '00'}` })}
                className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
              >
                {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map(h => (
                  <option key={h} value={h}>{h}시</option>
                ))}
              </select>
              <select 
                value={form.time.split(':')[1] || '00'} 
                onChange={(e) => setForm({ ...form, time: `${form.time.split(':')[0] || '00'}:${e.target.value}` })}
                className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm focus:border-primary focus:outline-none"
              >
                {['00', '15', '30', '45'].map(m => (
                  <option key={m} value={m}>{m}분</option>
                ))}
              </select>
            </div>
          </div>

          {/* 카테고리 */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#968178]">카테고리</label>
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => {
                const active = form.category === cat; 
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm({ ...form, category: cat })}
                    aria-pressed={active}
                    className={clsx(
                      'cursor-pointer rounded-full border-0 px-4 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary text-white'
                        : 'bg-primary-light text-primary hover:bg-primary/15'
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 메모 */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#968178]">메모</label>
            <textarea
              placeholder="추가 메모 (선택사항)"
              value={form.memo}
              onChange={(e) => setForm({ ...form, memo: e.target.value })}
              className="min-h-25 w-full resize-none rounded-lg border border-border bg-white px-3 py-2 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
            />
          </div>

          {/* 하단 버튼 영역 */}
          <div className="mt-2 flex gap-3">
            <Button 
              type="button" 
              variant="secondary"
              className="flex-1" 
              onClick={onClose}
            >
              취소
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
            >
              {isEditMode ? '변경사항 저장' : '추가하기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}