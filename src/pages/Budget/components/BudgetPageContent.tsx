// src/pages/Budget/components/BudgetPageContent.tsx
import type { ReactNode } from 'react';
import clsx from 'clsx';
import { 
  Building2, Camera, Plane, Heart, MoreHorizontal, Check, Wallet, Receipt, 
  CheckCircle2, Edit2, Trash2
} from 'lucide-react';

import BaseCard from '../../../components/ui/BaseCard';
import ProgressBar from '../../../components/ui/ProgressBar';
import type { BudgetCategory, BudgetItem } from '../hooks/useBudget';

const CATEGORIES: BudgetCategory[] = ['웨딩홀/예식장', '스튜디오/드레스', '허니문', '예물/예단', '기타'];
const CATEGORY_ICONS = {
  '웨딩홀/예식장': Building2,
  '스튜디오/드레스': Camera,
  '허니문': Plane,
  '예물/예단': Heart,
  '기타': MoreHorizontal,
};

interface BudgetPageContentProps {
  items: BudgetItem[];
  targetBudget: number;
  readOnly?: boolean;
  fallbackUI?: ReactNode;
  onEditBudgetClick?: () => void;
  onTogglePaidStatus?: (id: string) => void;
  onEditItemClick?: (item: BudgetItem) => void;
  onDeleteItemClick?: (id: string) => void;
}

export default function BudgetPageContent({
  items,
  targetBudget,
  readOnly = false,
  fallbackUI,
  onEditBudgetClick,
  onTogglePaidStatus,
  onEditItemClick,
  onDeleteItemClick,
}: BudgetPageContentProps) {
  const safeTargetBudget = Number(targetBudget) || 0;
  
  const totalPaid = items.filter(item => item.isPaid).reduce((acc, item) => acc + (item.paidAmount || item.budgetAmount), 0);
  const paidCount = items.filter(item => item.isPaid).length;
  const totalCount = items.length;
  
  const overallProgress = targetBudget === 0 ? 0 : Math.round((totalPaid / safeTargetBudget) * 100);
  const remainingBudget = safeTargetBudget - totalPaid;

  return (
    <div>
      {/* 1. 상단 요약 카드 3개 */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* 전체 예산 카드 */}
        <BaseCard className="flex h-full flex-col justify-between p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light/50">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-text-muted">전체 예산</p>
              <p className="text-xl font-bold font-serif leading-none text-text">{targetBudget}만원</p>
            </div>
            {!readOnly && (
              <button 
                onClick={onEditBudgetClick}
                className="text-xs leading-none text-text-muted underline decoration-text-muted/40 underline-offset-2 hover:text-text"
              >
                예산 변경하기
              </button>
            )}
          </div>
        </BaseCard>

        {/* 집행 금액 카드 */}
        <BaseCard className="flex h-full flex-col justify-between p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light/50">
            <Receipt className="h-5 w-5 text-[#d29b53]" />
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-text-muted">집행 금액</p>
              <p className="text-xl font-bold font-serif leading-none text-text">{totalPaid}만원</p>
            </div>
          </div>
        </BaseCard>

        {/* 결제 완료 카드 */}
        <BaseCard className="flex h-full flex-col justify-between p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light/50">
            <CheckCircle2 className="h-5 w-5 text-[#c382a4]" />
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-text-muted">결제 완료</p>
              <p className="text-xl font-bold font-serif leading-none text-text">{paidCount}/{totalCount}건</p>
            </div>
          </div>
        </BaseCard>
      </div>

      {/* 2. 전체 집행률 프로그레스 바 */}
      <BaseCard className="mb-6 p-6 md:p-8">
        <div className="mb-3 flex items-end justify-between">
          <span className="text-sm font-semibold text-text md:text-base">전체 집행률</span>
          <span className="text-2xl font-bold font-serif text-primary md:text-3xl">{overallProgress}%</span>
        </div>
        <div className="mb-3">
          <ProgressBar value={totalPaid} max={targetBudget} showLabel={false} />
        </div>
        <div className="flex items-center justify-between text-xs font-medium text-text-muted md:text-sm">
          <span>예산 {targetBudget}만원</span>
          <span>잔액 {remainingBudget}만원</span>
        </div>
      </BaseCard>

      {/* 3. 카테고리별 리스트 */}
      <div className="flex flex-col gap-6">
        {fallbackUI}

        {CATEGORIES.map(category => {
          const categoryItems = items.filter(item => item.category === category);
          if (categoryItems.length === 0) return null;

          const catTotalBudget = categoryItems.reduce((acc, item) => acc + item.budgetAmount, 0);
          const catTotalPaid = categoryItems.filter(item => item.isPaid).reduce((acc, item) => acc + (item.paidAmount || item.budgetAmount), 0);
          const catPaidCount = categoryItems.filter(item => item.isPaid).length;
          const catProgress = catTotalBudget === 0 ? 0 : Math.round((catTotalPaid / catTotalBudget) * 100);
          const Icon = CATEGORY_ICONS[category];

          return (
            <BaseCard key={category} className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light/30">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-serif text-text">{category}</h3>
                    <p className="text-xs text-text-muted">{categoryItems.length}개 항목 · {catPaidCount}건 결제 완료</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-text">{catTotalPaid}만원 / {catTotalBudget}만원</p>
                  <p className="text-xs font-medium text-text-muted">{catProgress}%</p>
                </div>
              </div>

              <div className="mb-4">
                <ProgressBar value={catTotalPaid} max={catTotalBudget} showLabel={false} />
              </div>

              <div className="flex flex-col gap-1">
                {categoryItems.map(item => (
                  <div key={item.id} className="group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      {/* 체크박스 기능 제한 */}
                      <button
                        onClick={() => !readOnly && onTogglePaidStatus?.(item.id)}
                        className={clsx(
                          'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                          readOnly ? 'cursor-default' : 'cursor-pointer group-hover:border-primary',
                          item.isPaid ? 'border-primary bg-primary' : 'border-gray-300 bg-white'
                        )}
                      >
                        {item.isPaid && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                      </button>
                      <span className={clsx('text-sm transition-all', item.isPaid ? 'font-medium text-text' : 'text-text-muted')}>
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-text">
                        {item.isPaid ? `${item.paidAmount || item.budgetAmount}만원` : `${item.budgetAmount}만원`}
                      </span>
                      
                      {/* 수정/삭제 버튼 숨김 처리 */}
                      {!readOnly && (
                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button onClick={() => onEditItemClick?.(item)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4f4f4] text-[#8e8e8e] transition-colors hover:bg-gray-200">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => onDeleteItemClick?.(item.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#F04444] transition-colors hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </BaseCard>
          );
        })}
      </div>
    </div>
  );
}