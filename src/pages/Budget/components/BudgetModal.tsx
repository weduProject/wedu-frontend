import { useState } from 'react';
import clsx from 'clsx';
import Button from '../../../components/ui/Button';
import TextField from '../../../components/ui/TextField';
import type { BudgetCategory } from '../hooks/useBudget';

interface BudgetModalProps {
  onClose: () => void;
  onSubmit: (item: { category: BudgetCategory; title: string; budgetAmount: number; isPaid: boolean; paidAmount: number }) => void;
}

const CATEGORIES: BudgetCategory[] = ['웨딩홀/예식장', '스튜디오/드레스', '허니문', '예물/예단', '기타'];

export default function BudgetModal({ onClose, onSubmit }: BudgetModalProps) {
  const [category, setCategory] = useState<BudgetCategory>('웨딩홀/예식장');
  const [title, setTitle] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !budgetAmount) return;

    onSubmit({
      category,
      title: title.trim(),
      budgetAmount: Number(budgetAmount),
      // 새 항목은 기본적으로 미결제 상태(0원)로 추가됨
      isPaid: false,
      paidAmount: 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-110 animate-in zoom-in-95 fade-in duration-200 rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-5 text-lg font-bold text-text">새 예산 항목 추가</h3>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* 카테고리 선택 */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">카테고리</label>
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
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
          

          {/* 항목 이름 입력 */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">항목 이름</label>
            <TextField
              placeholder="예: 스냅 촬영 잔금"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 예상 금액 입력 */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">예상 금액 (만원)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="0"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
              <span className="font-bold text-text">만원</span>
            </div>
          </div>

          {/* 하단 버튼 영역 */}
          <div className="mt-4 flex gap-2">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-text hover:bg-gray-300"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !budgetAmount}
              className="flex-1 disabled:opacity-50"
            >
              추가하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}