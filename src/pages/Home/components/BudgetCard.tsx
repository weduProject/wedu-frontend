import BaseCard from '../../../components/ui/BaseCard';

export default function BudgetCard() {
  return (
    <BaseCard title="예산 현황">
      <p className="text-lg font-bold mt-1">OOO원</p>
      <p className="text-xs text-text-muted mb-2">/ OOO원</p>
      <p className="text-xs text-text-muted">예산을 입력하면 현황이 표시됩니다.</p>
    </BaseCard>
  );
}
