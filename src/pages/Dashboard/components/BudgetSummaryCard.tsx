import BaseCard from '../../../components/ui/BaseCard';
import { useBudget } from '../../Budget/hooks/useBudget';
import { DollarSign } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import ProgressBar from '../../../components/ui/ProgressBar';

export default function BudgetSummaryCard() {
  const { items, targetBudget } = useBudget();
  const { user } = useAuth();

  // 📊 집행 금액 및 완료 건수
  const totalPaid = items.reduce((acc, item) => acc + item.paidAmount, 0);
  const paidCount = items.filter((item) => item.isPaid).length;
  const totalCount = items.length;

  if (!user) {
    return (
      <BaseCard className="flex h-full flex-col p-6 shadow-sm border border-border/30 rounded-[2rem]">
        <h3 className="mb-4 text-base font-bold text-text">예산 현황</h3>
        <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light/30">
            <DollarSign className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm text-text-muted">예산을 등록하면<br />지출 현황을 한눈에</p>
        </div>
      </BaseCard>
    );
  }

  return (
    <BaseCard className="flex h-full flex-col p-6 shadow-sm border border-border/30 rounded-[2rem] transition-transform hover:scale-[1.01]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF0F0]">
             <DollarSign className="h-4 w-4 text-[#ECA5A5]" strokeWidth={3} />
          </div>
          <h3 className="text-base font-bold text-text">예산 현황</h3>
        </div>
        <span className="text-xs font-semibold text-[#ECA5A5]">전체보기</span>
      </div>

      <div className="flex justify-between items-end mb-2">
         <span className="text-sm font-medium text-text-muted">전체 예산</span>
         <span className="text-base font-bold text-text">{targetBudget}만원</span>
      </div>
      
      <ProgressBar value={totalPaid} max={targetBudget} showLabel={false} />

      <div className="flex justify-between items-end mt-4">
         <span className="text-sm font-medium text-text-muted">집행 금액</span>
         <span className="text-base font-bold text-text">{totalPaid}만원</span>
      </div>

      <div className="mt-8 pt-4 flex items-center gap-2 text-xs font-medium text-text-muted">
         <span>총 {totalCount}개 항목</span>
         <span className="text-gray-300">•</span>
         <span>{paidCount}건 결제 완료</span>
      </div>
    </BaseCard>
  );
}