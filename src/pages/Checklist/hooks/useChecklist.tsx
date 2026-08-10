// src/pages/Checklist/hooks/useChecklist.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// 타입 정의
export type CategoryType = '기본' | '예식' | '촬영' | '예물' | '주거' | '여행';
export interface TodoItem {
  id: string;
  text: string;
  category: CategoryType;
  isCompleted: boolean;
}

export const RECOMMENDED_TODOS: Record<CategoryType, string[]> = {
  기본: ['결혼식 날짜 정하기', '청첩장 제작'],
  예식: ['예식장 투어 및 계약', '본식 메이크업 예약', '웨딩 케이크 주문', '부케 선택'],
  촬영: ['스튜디오 예약', '드레스 투어'],
  예물: ['웨딩밴드 맞추기'],
  주거: ['신혼집 구하기', '혼수 장만'],
  여행: ['허니문 예약']
};

interface ChecklistContextType {
  todos: TodoItem[];
  addTodo: (text: string, category: CategoryType) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, newText: string) => void;
}

const ChecklistContext = createContext<ChecklistContextType | undefined>(undefined);

export function ChecklistProvider({ children }: { children: ReactNode }) {
    const [todos, setTodos] = useState<TodoItem[]>(() => {
    const savedTodos = localStorage.getItem('wedding_checklist_todos');
    if (savedTodos) {
      try {
        return JSON.parse(savedTodos);
      } catch (e) {
        console.error('Failed to parse todos from localStorage');
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('wedding_checklist_todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, category: CategoryType) => {
    const newTodo: TodoItem = { id: Date.now().toString(), text, category, isCompleted: false };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id: string, newText: string) => {
  setTodos((prev) =>
    prev.map((todo) => (todo.id === id ? { ...todo, text: newText } : todo))
  );
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