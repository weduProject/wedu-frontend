import BaseCard from '../../../components/ui/BaseCard';
import { useBudget } from '../../Budget/hooks/useBudget';
import { Wallet, CheckCircle2 } from 'lucide-react';

export default function BudgetSummaryCard() {
  const { items, targetBudget } = useBudget();

  // 📊 집행 금액 및 완료 건수
  const totalPaid = items.reduce((acc, item) => acc + item.paidAmount, 0);
  const paidCount = items.filter((item) => item.isPaid).length;
  const totalCount = items.length;

  return (
    <BaseCard className="flex h-full flex-col justify-between p-5 shadow-sm transition-transform hover:scale-[1.01]">
      <h3 className="text-sm font-bold text-text">예산 관리</h3>

      <div className="my-6 flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-extrabold text-primary">{totalPaid}</span>
          <span className="text-base font-bold text-primary">만원</span>
          <span className="ml-1 text-sm font-medium text-text-muted">/ {targetBudget}만원</span>
        </div>
        
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-light/50">
          <Wallet className="h-5 w-5 text-primary" strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-text-muted" strokeWidth={2.5} />
          <span className="text-sm font-medium text-text-muted">결제 완료</span>
        </div>
        <span className="text-base font-bold text-text">
          {paidCount} <span className="text-sm font-medium text-text-muted">/ {totalCount} 건</span>
        </span>
      </div>
    </BaseCard>
  );
}
