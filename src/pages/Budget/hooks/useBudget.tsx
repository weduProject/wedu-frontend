import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { apiFetch } from '../../../lib/apiClient';
import { useAuth } from '../../../contexts/AuthContext';

export type BudgetCategory = '웨딩홀/예식장' | '스튜디오/드레스' | '허니문' | '예물/예단' | '기타';

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  title: string;
  paidAmount: number;
  budgetAmount: number;
  isPaid: boolean;
}

const CATEGORY_TO_ENUM: Record<BudgetCategory, string> = {
  '웨딩홀/예식장': 'VENUE',
  '스튜디오/드레스': 'STUDIO_DRESS',
  '허니문': 'HONEYMOON',
  '예물/예단': 'JEWELRY_GIFTS',
  '기타': 'OTHER',
};

const ENUM_TO_CATEGORY: Record<string, BudgetCategory> = {
  VENUE: '웨딩홀/예식장',
  STUDIO_DRESS: '스튜디오/드레스',
  HONEYMOON: '허니문',
  JEWELRY_GIFTS: '예물/예단',
  OTHER: '기타',
};

interface BudgetContextType {
  items: BudgetItem[];
  targetBudget: number;
  updateTargetBudget: (amount: number) => void;
  addBudgetItem: (newItem: Omit<BudgetItem, 'id'>) => void;
  togglePaidStatus: (id: string) => void;
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void; 
  deleteBudgetItem: (id: string) => void;
}

interface BackendBudgetItem {
  itemId: number;
  title: string;
  category: string;
  plannedAmount: number;
  spentAmount: number;
  completed: boolean;
}

interface BackendBudgetCategory {
  category: string;
  summary: {
    plannedAmount: number;
    spentAmount: number;
    balance: number;
    completedCount: number;
    totalCount: number;
    executionRatePercentage: number;
  };
  items: BackendBudgetItem[];
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [targetBudget, setTargetBudget] = useState<number>((0));

  // 1. 전체 예산 및 항목 조회 (GET)
  const fetchBudgetData = useCallback(async () => {
    if (!user) {
      setItems([]);
      setTargetBudget(0);
      return;
    }

    try {
      const res = await apiFetch('/api/budget-items');
      if (!res.ok) throw new Error('예산 데이터 로드 실패');
      
      const body = await res.json();
      if (body.success && body.data) {
        setTargetBudget(body.data.totalBudget);
        
        const parsedItems: BudgetItem[] = [];
        body.data.categories.forEach((cat: BackendBudgetCategory) => {
          cat.items.forEach((item: BackendBudgetItem) => {
            parsedItems.push({
              id: String(item.itemId),
              title: item.title,
              category: ENUM_TO_CATEGORY[item.category] || '기타',
              budgetAmount: item.plannedAmount,
              paidAmount: item.spentAmount,
              isPaid: item.completed
            });
          });
        });
        
        setItems(parsedItems);
      }
    } catch (error) {
      console.error('API 호출 에러:', error);
      setItems([]);
    }
  }, [user]);

  useEffect(() => {
    fetchBudgetData();
  }, [fetchBudgetData]);

  // 2. 목표 예산 설정 (PUT)
  const updateTargetBudget = async (amount: number) => {
    setTargetBudget(amount);
    try {
      await apiFetch('/api/budgets/me', {
        method: 'PUT',
        body: JSON.stringify({ totalBudget: amount }),
      });
    } catch (error) {
      console.error('목표 예산 업데이트 실패:', error);
      fetchBudgetData();
    }
  };

  // 3. 예산 항목 생성 (POST)
  const addBudgetItem = async (newItem: Omit<BudgetItem, 'id'>) => {
    const tempId = Date.now().toString();
    setItems((prev) => [{ ...newItem, id: tempId }, ...prev]);

    try {
      const res = await apiFetch('/api/budget-items', {
        method: 'POST',
        body: JSON.stringify({
          title: newItem.title,
          category: CATEGORY_TO_ENUM[newItem.category],
          plannedAmount: newItem.budgetAmount,
          spentAmount: newItem.paidAmount,
        }),
      });
      const body = await res.json();
      if (body.success && body.data) {
        setItems((prev) => prev.map((item) => 
          item.id === tempId ? { ...item, id: String(body.data.itemId) } : item
        ));
      }
    } catch (error) {
      console.error('항목 생성 실패:', error);
      fetchBudgetData(); 
    }
  };

  // 4. 결제 완료 상태 변경 (PATCH)
  const togglePaidStatus = async (id: string) => {
    const target = items.find(item => item.id === id);
    if (!target) return;

    const newIsPaid = !target.isPaid;
    const newPaidAmount = newIsPaid ? target.budgetAmount : 0;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isPaid: newIsPaid, paidAmount: newIsPaid ? item.budgetAmount : 0 } : item
      )
    );

    try {
      await Promise.all([
        apiFetch(`/api/budget-items/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: target.title,
            category: CATEGORY_TO_ENUM[target.category],
            plannedAmount: target.budgetAmount,
            spentAmount: newPaidAmount,
          }),
        }),
        apiFetch(`/api/budget-items/${id}/completion`, {
          method: 'PATCH',
          body: JSON.stringify({ completed: newIsPaid }),
        }),
      ]);
    } catch (error) {
      console.error('상태 변경 에러:', error);
      fetchBudgetData();
    }
  };

  // 5. 항목 수정 (PUT)
  const updateBudgetItem = async (id: string, updates: Partial<BudgetItem>) => {
    const currentItem = items.find(i => i.id === id);
    if (!currentItem) return;

    const updatedTitle = updates.title ?? currentItem.title;
    const updatedCategory = updates.category ?? currentItem.category;
    const updatedBudgetAmount = updates.budgetAmount ?? currentItem.budgetAmount;
    const updatedPaidAmount = updates.paidAmount ?? currentItem.paidAmount;
    const newIsPaid = updates.isPaid !== undefined ? updates.isPaid : updatedPaidAmount > 0;

    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));

    try {
      const requests: Promise<Response>[] = [
        apiFetch(`/api/budget-items/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
            title: updatedTitle,
            category: CATEGORY_TO_ENUM[updatedCategory],
            plannedAmount: updatedBudgetAmount,
            spentAmount: updatedPaidAmount,
          }),
        }),
      ];

      if (newIsPaid !== currentItem.isPaid) {
        requests.push(
          apiFetch(`/api/budget-items/${id}/completion`, {
            method: 'PATCH',
            body: JSON.stringify({ completed: newIsPaid }),
          })
        );
      }

      await Promise.all(requests);
    } catch (error) {
      console.error('항목 수정 에러:', error);
      fetchBudgetData();
    }
  };

  // 6. 삭제 (DELETE)
  const deleteBudgetItem = async (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await apiFetch(`/api/budget-items/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('삭제 에러:', error);
      fetchBudgetData();
    }
  };

  return (
    <BudgetContext.Provider value={{
        items, targetBudget, updateTargetBudget, addBudgetItem, togglePaidStatus,
        updateBudgetItem, deleteBudgetItem
        }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) throw new Error('useBudget은 BudgetProvider 안에서 사용되어야 합니다.');
  return context;
}