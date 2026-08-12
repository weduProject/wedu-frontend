// src/pages/Checklist/SharedChecklistPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';import { apiFetch } from '../../lib/apiClient';
import BaseCard from '../../components/ui/BaseCard';
import ProgressBar from '../../components/ui/ProgressBar';

export type ChecklistCategoryEnum = 'BASIC' | 'CEREMONY' | 'SHOOTING' | 'JEWELRY' | 'HOUSING' | 'TRAVEL';

export interface ChecklistItem {
  itemId: number;
  title: string;
  category: ChecklistCategoryEnum;
  completed: boolean;
}

export interface ChecklistOverviewData {
  totalCount: number;
  completedCount: number;
  remainingCount: number;
  progressPercentage: number;
  items: ChecklistItem[];
}

const ENUM_TO_CATEGORY: Record<ChecklistCategoryEnum, string> = {
  BASIC: '기본',
  CEREMONY: '예식',
  SHOOTING: '촬영',
  JEWELRY: '예물',
  HOUSING: '주거',
  TRAVEL: '여행',
};

export default function SharedChecklistPage() {
  const { token } = useParams<{ token: string }>();
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    apiFetch(`/api/checklist-items/shared/${token}`)
      .then((res) => res.json())
      .then((body) => {
        setItems(body.data?.items || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [token]);

  const completedCount = items.filter((item) => item.completed).length;
  const totalCount = items.length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  if (isLoading) return <div className="py-20 text-center">로딩 중...</div>;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h2 className="mb-2 text-2xl font-bold font-serif text-text">공유된 웨딩 체크리스트</h2>
      <p className="mb-6 text-sm text-text-muted">조회 전용 페이지입니다.</p>

      {/* 진행률 카드 */}
      <BaseCard className="mb-6 p-6 shadow-sm">
        <div className="mb-2 flex justify-between font-bold">
          <span>전체 진행률</span>
          <span className="text-primary">{progressPercentage}%</span>
        </div>
        <ProgressBar value={completedCount} max={totalCount} showLabel={false} />
      </BaseCard>

      {/* 목록 (수정/삭제/클릭 불가능한 읽기 전용) */}
      <BaseCard className="p-6 shadow-sm">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div key={item.itemId} className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
              <span className={(item.completed) ? 'line-through text-gray-400' : 'text-text'}>
                {item.title}
              </span>
              <span className="text-xs font-medium text-primary">{ENUM_TO_CATEGORY[item.category]}</span>
            </div>
          ))}
        </div>
      </BaseCard>
    </div>
  );
}