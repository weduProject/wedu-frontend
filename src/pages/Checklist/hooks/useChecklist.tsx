// src/pages/Checklist/hooks/useChecklist.tsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { apiFetch, getToken } from '../../../lib/apiClient';
import { useAuth } from '../../../contexts/AuthContext';

// 타입 정의
export type CategoryType = '기본' | '예식' | '촬영' | '예물' | '주거' | '여행';
export interface TodoItem {
  id: string;
  text: string;
  category: CategoryType;
  isCompleted: boolean;
}

export type ChecklistCategoryEnum = 'BASIC' | 'CEREMONY' | 'SHOOTING' | 'JEWELRY' | 'HOUSING' | 'TRAVEL';

export interface ChecklistItemResponse {
  itemId: number;
  title: string;
  category: ChecklistCategoryEnum;
  completed: boolean;
}

export interface ChecklistOverviewResponseData {
  totalCount: number;
  completedCount: number;
  remainingCount: number;
  progressPercentage: number;
  items: ChecklistItemResponse[];
}

export const RECOMMENDED_TODOS: Record<CategoryType, string[]> = {
  기본: ['결혼식 날짜 정하기', '청첩장 제작'],
  예식: ['예식장 투어 및 계약', '본식 메이크업 예약', '웨딩 케이크 주문', '부케 선택'],
  촬영: ['스튜디오 예약', '드레스 투어'],
  예물: ['웨딩밴드 맞추기'],
  주거: ['신혼집 구하기', '혼수 장만'],
  여행: ['허니문 예약']
};

// 백엔드 카테고리 매핑
const CATEGORY_TO_ENUM: Record<CategoryType, string> = {
  '기본': 'BASIC',
  '예식': 'CEREMONY',
  '촬영': 'SHOOTING',
  '예물': 'JEWELRY',
  '주거': 'HOUSING',
  '여행': 'TRAVEL',
};

const ENUM_TO_CATEGORY: Record<string, CategoryType> = {
  BASIC: '기본',
  CEREMONY: '예식',
  SHOOTING: '촬영',
  JEWELRY: '예물',
  HOUSING: '주거',
  TRAVEL: '여행',
};

interface ChecklistContextType {
  todos: TodoItem[];
  isLoading: boolean;
  addTodo: (text: string, category: CategoryType) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, newText: string) => void;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authIsLoading } = useAuth();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. 조회 (GET)
  const fetchTodos = useCallback(async () => {
    if (!getToken()) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiFetch('/api/checklist-items');
      if (!res.ok) throw new Error('체크리스트 로드 실패');
      
      const body = await res.json();
      const overviewData: ChecklistOverviewResponseData | null = body.data;
      const items = overviewData?.items || [];
      
      const mappedTodos: TodoItem[] = items.map((item) => ({
        id: String(item.itemId),
        text: item.title,
        category: ENUM_TO_CATEGORY[item.category] || '기본',
        isCompleted: item.completed,
      }));

      setTodos(mappedTodos);
    } catch (error) {
      console.warn('API 호출 실패', error);
      setTodos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authIsLoading) return;
    
    if (user) {
      fetchTodos();
    } else {
      setTodos([]);
    }
  }, [fetchTodos, user]);

  // 2. 생성 (POST)
  const addTodo = async (text: string, category: CategoryType) => {
    const tempId = String(Date.now());
    const newTodo: TodoItem = { id: tempId, text, category, isCompleted: false };
    setTodos((prev) => [newTodo, ...prev]); // 낙관적 업데이트

  try {
      const res = await apiFetch('/api/checklist-items', {
        method: 'POST',
        body: JSON.stringify({
          title: text, // 백엔드 DTO에 맞게 필드명 변경 필요할 수 있음
          category: CATEGORY_TO_ENUM[category],
        }),
      });
      if (!res.ok) throw new Error('체크리스트 저장 실패');
      const body = await res.json();
      const saved: ChecklistItemResponse = body.data;

      setTodos((prev) => prev.map((todo) => 
        todo.id === tempId ? { ...todo, id: String(saved.itemId || saved.itemId) } : todo
      ));
    } catch (error) {
      console.error('할 일 추가 에러:', error);
      setTodos((prev) => prev.filter((todo) => todo.id !== tempId));
    }
  };

  // 3. 완료 상태 변경 (PATCH)
  const toggleTodo = async (id: string) => {
    const prevItem = todos.find((t) => t.id === id);
    if (!prevItem) return;
    const newCompletedState = !prevItem.isCompleted;

    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, isCompleted: newCompletedState } : todo))
    );

  try {
      const res = await apiFetch(`/api/checklist-items/${id}/completion`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: newCompletedState }), 
      });
      if (!res.ok) throw new Error('상태 변경 실패');
    } catch (error) {
      console.error('상태 변경 에러:', error);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, isCompleted: !newCompletedState } : todo))
      );
    }
  };

  // 4. 삭제 (DELETE)
  const deleteTodo = async (id: string) => {
    const targetItem = todos.find((todo) => todo.id === id);
    if (!targetItem) return;

    setTodos((prev) => prev.filter((todo) => todo.id !== id));

  try {
      const res = await apiFetch(`/api/checklist-items/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('삭제 실패');
    } catch (error) {
      console.error('할 일 삭제 에러:', error);
      setTodos((prev) => [targetItem, ...prev]);
    }
  };

  // 5. 항목 텍스트 수정 (PUT)
  const updateTodo = async (id: string, newText: string) => {
    const prevItem = todos.find((t) => t.id === id);
    if (!prevItem) return;
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
    );
    
    try {
      const res = await apiFetch(`/api/checklist-items/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: newText,
          category: CATEGORY_TO_ENUM[prevItem.category],
        }),
      });
      if (!res.ok) throw new Error('수정 실패');
    } catch (error) {
      console.error('할 일 수정 에러:', error);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, text: prevItem.text } : todo))
      );
    }
  };

  return (
    <ChecklistContext.Provider value={{ todos, addTodo, toggleTodo, deleteTodo, updateTodo }}>
      {children}
    </ChecklistContext.Provider>
  );
}

export function useChecklist() {
  const context = useContext(ChecklistContext);
  if (context === undefined) {
    throw new Error('useChecklist는 ChecklistProvider 안에서 사용되어야 합니다.');
  }
  return context;
}