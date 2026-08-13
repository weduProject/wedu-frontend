import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import type { BudgetCategory, BudgetItem } from '../hooks/useBudget';
import clsx from 'clsx';
import { TextField } from '../../../components';

interface BudgetEditModalProps {
  item: BudgetItem;
  onClose: () => void;
  onSave: (id: string, updates: Partial<BudgetItem>) => void;
  onDelete: (id: string) => void;
}

const CATEGORIES: BudgetCategory[] = ['웨딩홀/예식장', '스튜디오/드레스', '허니문', '예물/예단', '기타'];

export default function BudgetEditModal({ item, onClose, onSave, onDelete }: BudgetEditModalProps) {
  const [category, setCategory] = useState<BudgetCategory>(item.category);
  const [title, setTitle] = useState(item.title);
  const [paidAmount, setPaidAmount] = useState(item.paidAmount.toString());
  const [budgetAmount, setBudgetAmount] = useState(item.budgetAmount.toString());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave(item.id, {
      category,
      title: title.trim(),
      paidAmount: Number(paidAmount),
      budgetAmount: Number(budgetAmount),
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-text">{item.title}</h3>
          
          <button 
            type="button"
            onClick={() => onDelete(item.id)}
            className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
            삭제
          </button>
        </div>
        
        <form onSubmit={handleSave} className="flex flex-col gap-4">

          {/* ✨ 카테고리 수정 영역 추가 */}
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
                    className={clsx(
                      'cursor-pointer rounded-full border-0 px-3 py-1.5 text-xs font-medium transition-colors',
                      active ? 'bg-primary text-white' : 'bg-primary-light text-primary hover:bg-primary/15'
                    )}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ✨ 항목 이름 수정 영역 추가 */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-muted">항목 이름</label>
            <TextField
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mt-4 flex gap-2">
            {/* 실제 결제 금액 수정 */}
            <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-text-muted">실제 결제 금액 (만원) /</label>
                <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-border bg-white px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
                />
                </div>
            </div>

            {/* 예산 금액 수정 */}
            <div className="flex-1">
                <label className="mb-1.5 block text-sm font-medium text-text-muted">예산 (만원)</label>
                <div className="flex items-center gap-2">
                <input
                    type="number"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="min-w-0 flex-1 rounded-xl border border-border bg-white px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
                />
                </div>
            </div>
          </div>
          

          <div className="mt-4 flex gap-2">
            <Button type="button" variant='secondary' onClick={onClose} className="flex-1 bg-gray-200 text-text hover:bg-gray-300">
              취소
            </Button>
            <Button type="submit" className="flex-1">
              저장하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}