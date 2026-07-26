// src/pages/Checklist/components/ChecklistSummaryCard.tsx
import BaseCard from '../../../components/ui/BaseCard';
import ProgressBar from '../../../components/ui/ProgressBar';
import { useChecklist } from '../../Checklist/hooks/useChecklist';

export default function ChecklistSummaryCard() {
  const { todos } = useChecklist();

  // 진행률 계산
  const totalCount = todos.length;
  const completedCount = todos.filter((todo) => todo.isCompleted).length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <BaseCard className="flex h-full flex-col justify-center p-5 shadow-sm">
      <div className="mb-3 flex items-end justify-between">
        <h3 className="text-sm font-bold text-text">체크리스트</h3>
        <span className="text-xl font-bold text-primary">{progressPercentage}%</span>
      </div>
      
      <div className="mb-3">
        <ProgressBar value={completedCount} max={totalCount} showLabel={false} />
      </div>
      
      <p className="text-right text-xs font-medium text-text-muted">
        {completedCount} / {totalCount} 완료
      </p>
    </BaseCard>
  );
}
