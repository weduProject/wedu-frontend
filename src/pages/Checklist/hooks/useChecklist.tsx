// src/pages/Checklist/hooks/useChecklist.tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// 타입 정의
export type CategoryType = '기본' | '예식' | '촬영' | '예물' | '주거' | '여행';
export interface TodoItem {
  id: string;
  text: string;
  category: CategoryType;
  isCompleted: boolean;
}

const INITIAL_TODOS: TodoItem[] = [
  { id: '1', text: '결혼식 날짜 정하기', category: '기본', isCompleted: true },
  { id: '2', text: '예식장 투어 및 계약', category: '예식', isCompleted: true },
  { id: '3', text: '스튜디오 예약', category: '촬영', isCompleted: true },
  { id: '4', text: '드레스 투어', category: '촬영', isCompleted: false },
  { id: '5', text: '신혼집 구하기', category: '주거', isCompleted: true },
  { id: '6', text: '웨딩밴드 맞추기', category: '예물', isCompleted: false },
  { id: '7', text: '청첩장 제작', category: '기본', isCompleted: true },
  { id: '8', text: '허니문 예약', category: '여행', isCompleted: true },
  { id: '9', text: '혼수 장만', category: '주거', isCompleted: false },
  { id: '10', text: '본식 메이크업 예약', category: '예식', isCompleted: false },
  { id: '11', text: '웨딩 케이크 주문', category: '예식', isCompleted: false },
  { id: '12', text: '부케 선택', category: '예식', isCompleted: false },
];

interface ChecklistContextType {
  todos: TodoItem[];
  addTodo: (text: string, category: CategoryType) => void;
  toggleTodo: (id: string) => void;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export function ChecklistProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<TodoItem[]>(INITIAL_TODOS);

  const addTodo = (text: string, category: CategoryType) => {
    const newTodo: TodoItem = { id: Date.now().toString(), text, category, isCompleted: false };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo))
    );
  };

  return (
    <ChecklistContext.Provider value={{ todos, addTodo, toggleTodo }}>
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