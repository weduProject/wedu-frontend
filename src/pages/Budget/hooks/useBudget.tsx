import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export type BudgetCategory = '웨딩홀/예식장' | '스튜디오/드레스' | '허니문' | '예물/예단' | '기타';

export interface BudgetItem {
  id: string;
  category: BudgetCategory;
  title: string;
  paidAmount: number;
  budgetAmount: number;
  isPaid: boolean;
}

export const INITIAL_BUDGETS: BudgetItem[] = [
  // 1. 웨딩홀/예식장 (총 약 2,150만원 / 결제 진행중)
  { id: '1', category: '웨딩홀/예식장', title: '예식장 계약금', paidAmount: 200, budgetAmount: 200, isPaid: true },
  { id: '2', category: '웨딩홀/예식장', title: '웨딩홀 대관료 및 식대 잔금', paidAmount: 0, budgetAmount: 1800, isPaid: false },
  { id: '3', category: '웨딩홀/예식장', title: '본식 음향/전문 사회자', paidAmount: 30, budgetAmount: 30, isPaid: true },
  { id: '4', category: '웨딩홀/예식장', title: '플라워 샤워 및 생화 연출', paidAmount: 0, budgetAmount: 120, isPaid: false },

  // 2. 스튜디오/드레스/메이크업 (총 약 545만원 / 일부 결제 완료)
  { id: '5', category: '스튜디오/드레스', title: '스튜디오 촬영 패키지', paidAmount: 150, budgetAmount: 150, isPaid: true },
  { id: '6', category: '스튜디오/드레스', title: '드레스 투어 피팅비', paidAmount: 15, budgetAmount: 15, isPaid: true },
  { id: '7', category: '스튜디오/드레스', title: '본식 드레스 추가금 및 대여', paidAmount: 0, budgetAmount: 200, isPaid: false },
  { id: '8', category: '스튜디오/드레스', title: '본식 헤어 & 메이크업 (신랑신부)', paidAmount: 80, budgetAmount: 80, isPaid: true },
  { id: '9', category: '스튜디오/드레스', title: '촬영/본식 헬퍼 이모님 수고비', paidAmount: 0, budgetAmount: 50, isPaid: false },
  { id: '10', category: '스튜디오/드레스', title: '본식 원판 & 스냅 촬영', paidAmount: 50, budgetAmount: 50, isPaid: true },

  // 3. 허니문 (총 약 750만원)
  { id: '11', category: '허니문', title: '왕복 항공권 예약', paidAmount: 350, budgetAmount: 350, isPaid: true },
  { id: '12', category: '허니문', title: '리조트 & 호텔 숙박비', paidAmount: 250, budgetAmount: 250, isPaid: true },
  { id: '13', category: '허니문', title: '현지 투어 및 경비', paidAmount: 0, budgetAmount: 150, isPaid: false },

  // 4. 예물/예단 (총 약 470만원)
  { id: '14', category: '예물/예단', title: '웨딩밴드(커플링)', paidAmount: 250, budgetAmount: 250, isPaid: true },
  { id: '15', category: '예물/예단', title: '신랑 예복 맞춤(맞춤정장/수제화)', paidAmount: 120, budgetAmount: 120, isPaid: true },
  { id: '16', category: '예물/예단', title: '양가 혼주 한복 대여', paidAmount: 0, budgetAmount: 100, isPaid: false },

  // 5. 기타 (총 약 135만원)
  { id: '17', category: '기타', title: '모바일 및 종이 청첩장 제작', paidAmount: 35, budgetAmount: 35, isPaid: true },
  { id: '18', category: '기타', title: '식전 영상 제작', paidAmount: 10, budgetAmount: 10, isPaid: true },
  { id: '19', category: '기타', title: '하객 답례품', paidAmount: 0, budgetAmount: 60, isPaid: false },
  { id: '20', category: '기타', title: '웨딩 부케 & 코사지 세트', paidAmount: 0, budgetAmount: 30, isPaid: false },
];
interface BudgetContextType {
  items: BudgetItem[];
  targetBudget: number;
  updateTargetBudget: (amount: number) => void;
  addBudgetItem: (newItem: Omit<BudgetItem, 'id'>) => void;
  togglePaidStatus: (id: string) => void;
  updateBudgetItem: (id: string, updates: Partial<BudgetItem>) => void; 
  deleteBudgetItem: (id: string) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BudgetItem[]>(INITIAL_BUDGETS);
  const [targetBudget, setTargetBudget] = useState<number>(2360); // 초기 전체 예산 설정

  const updateTargetBudget = (amount: number) => setTargetBudget(amount);

  const addBudgetItem = (newItem: Omit<BudgetItem, 'id'>) => {
    setItems((prev) => [{ ...newItem, id: Date.now().toString() }, ...prev]);
  };

  const togglePaidStatus = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newIsPaid = !item.isPaid;
          return {
            ...item,
            isPaid: newIsPaid,
            // ✨ 핵심: 체크되면 예산 전액 집행 처리, 체크 해제되면 0원으로 롤백
            paidAmount: newIsPaid ? item.budgetAmount : 0, 
          };
        }
        return item;
      })
    );
  };

  const updateBudgetItem = (id: string, updates: Partial<BudgetItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deleteBudgetItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
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