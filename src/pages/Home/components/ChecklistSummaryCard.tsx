// src/pages/Checklist/components/ChecklistSummaryCard.tsx
import { useNavigate } from 'react-router-dom';
import BaseCard from '../../../components/ui/BaseCard';
import ProgressBar from '../../../components/ui/ProgressBar';
import { useAuth } from '../../../contexts/AuthContext';
import { useChecklist } from '../../Checklist/hooks/useChecklist';
import { Check } from 'lucide-react';

export default function ChecklistSummaryCard() {
  const { todos } = useChecklist();

  // 진행률 계산
  const totalCount = todos.length;
  const completedCount = todos.filter((todo) => todo.isCompleted).length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <BaseCard className="flex h-full flex-col p-6">
        <h3 className="mb-4 text-base font-bold text-text">체크리스트</h3>
        <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light/30">
            <Check className="h-6 w-6 text-primary" />
          </div>
          <p className="text-sm text-text-muted">할 일을 등록하고<br />진행률을 확인하세요</p>
        </div>
        <div className="mt-4 border-t border-border pt-4 text-center">
          <button onClick={(e) => {
            e.stopPropagation();
            navigate('/login')}} className="text-sm font-semibold text-primary hover:underline">
            로그인하고 시작하기
          </button>
        </div>
      </BaseCard>
    );
  }

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
