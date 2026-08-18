// src/pages/Budget/SharedBudgetPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import BudgetPageContent from './components/BudgetPageContent';
import type { BudgetCategory, BudgetItem } from './hooks/useBudget';

const ENUM_TO_CATEGORY: Record<string, BudgetCategory> = {
  VENUE: '웨딩홀/예식장',
  STUDIO_DRESS: '스튜디오/드레스',
  HONEYMOON: '허니문',
  JEWELRY_GIFTS: '예물/예단',
  OTHER: '기타',
};

interface SharedBudgetItem {
  itemId: number;
  title: string;
  category: string;
  plannedAmount: number;
  spentAmount: number;
  completed: boolean;
}

interface SharedBudgetCategory {
  category: string;
  items: SharedBudgetItem[];
}

export default function SharedBudgetPage() {
  const { token } = useParams<{ token: string }>();
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [targetBudget, setTargetBudget] = useState<number>(0);

  useEffect(() => {
    if (!token) return;
    apiFetch(`/api/budget-items/shared/${token}`)
      .then((res) => res.json())
      .then((body) => {
        if (body.success && body.data) {
          setTargetBudget(body.data.totalBudget);
          const parsedItems: BudgetItem[] = [];
          body.data.categories.forEach((cat: SharedBudgetCategory) => {
            cat.items.forEach((item: SharedBudgetItem) => {
              parsedItems.push({
                id: String(item.itemId),
                title: item.title,
                category: ENUM_TO_CATEGORY[item.category] || '기타',
                budgetAmount: item.plannedAmount,
                paidAmount: item.spentAmount,
                isPaid: item.completed,
              });
            });
          });
          setItems(parsedItems);
        }
      })
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold font-serif text-text md:text-3xl">공유된 예산 관리</h2>
        <p className="mt-2 text-sm text-text-muted">조회 전용 페이지입니다.</p>
      </div>

      <BudgetPageContent 
        items={items} 
        targetBudget={targetBudget} 
        readOnly={true} 
      />
    </div>
  );
}