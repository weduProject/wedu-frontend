// src/pages/Checklist/components/ChecklistPageContent.tsx
import { useState } from 'react';
import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Check, Edit2, Trash2 } from 'lucide-react';

import BaseCard from '../../../components/ui/BaseCard';
import ProgressBar from '../../../components/ui/ProgressBar';
import TextField from '../../../components/ui/TextField';
import Button from '../../../components/ui/Button';

import type { TodoItem, CategoryType } from '../hooks/useChecklist';

const CATEGORIES: CategoryType[] = ['기본', '예식', '촬영', '예물', '주거', '여행'];

interface ChecklistPageContentProps {
  todos: TodoItem[];
  readOnly?: boolean;
  fallbackUI?: ReactNode;
  onToggleTodo?: (id: string) => void;
  onAddTodo?: (text: string, category: CategoryType) => void;
  onUpdateTodo?: (id: string, text: string) => void;
  onDeleteTodo?: (id: string) => void;
}

export default function ChecklistPageContent({
  todos,
  readOnly = false,
  fallbackUI,
  onToggleTodo,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
}: ChecklistPageContentProps) {
  const [activeFilter, setActiveFilter] = useState<'전체' | CategoryType>('전체');
  const [inputText, setInputText] = useState('');
  const [inputCategory, setInputCategory] = useState<CategoryType>('기본');

  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editTodoText, setEditTodoText] = useState('');

  const completedCount = todos.filter((todo) => todo.isCompleted).length;
  const totalCount = todos.length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const remainingCount = totalCount - completedCount;

  const filteredTodos = todos.filter(
    (todo) => activeFilter === '전체' || todo.category === activeFilter
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !onAddTodo) return;
    onAddTodo(inputText.trim(), inputCategory);
    setInputText('');
  };

  const handleSaveEdit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (editTodoText.trim() && onUpdateTodo) {
      onUpdateTodo(id, editTodoText.trim());
      setEditingTodoId(null);
    }
  };

  return (
    <div>
      {/* 1. 진행률 카드 */}
      <BaseCard className="mb-6 p-6 md:p-8">
        <div className="mb-3 flex items-end justify-between">
          <span className="text-sm font-semibold text-text md:text-base">전체 진행률</span>
          <span className="text-2xl font-bold font-serif text-primary md:text-3xl">{progressPercentage}%</span>
        </div>
        
        <div className="mb-3">
          <ProgressBar value={completedCount} max={totalCount} showLabel={false} />
        </div>
        
        <div className="flex items-center justify-between text-xs font-medium text-text-muted md:text-sm">
          <span>{completedCount}개 완료</span>
          <span>{remainingCount}개 남음</span>
        </div>
      </BaseCard>

      {fallbackUI ? (
        fallbackUI
      ) : (
        <>
        {/* 2. 할 일 추가 폼 (readOnly 모드에서는 숨김) */}
      {!readOnly && onAddTodo && (
        <form onSubmit={handleAddSubmit} className="mb-6 flex items-start gap-3">
          <div className="flex-1">
            <TextField
              placeholder="새 할 일 추가..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          
          <select
            value={inputCategory}
            onChange={(e) => setInputCategory(e.target.value as CategoryType)}
            className="h-10.5 rounded-lg border border-border bg-white px-3 text-sm text-text focus:border-primary focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <Button type="submit" disabled={!inputText.trim()} className="h-10.5 min-w-20">
            추가
          </Button>
        </form>
      )}

      {/* 3. 카테고리 필터 칩 */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveFilter('전체')}
          className={clsx(
            'cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors',
            activeFilter === '전체' ? 'category-tab-active' : 'category-tab-inactive',
          )}
        >
          전체
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveFilter(cat)}
            className={clsx(
              'cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors',
              activeFilter === cat ? 'category-tab-active' : 'category-tab-inactive',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4. 체크리스트 목록 영역 */}
      <BaseCard className="p-6">
        <div className="flex flex-col gap-3">
          {filteredTodos.length === 0 ? (
            <p className="py-10 text-center text-sm text-text-muted">해당 카테고리에 등록된 할 일이 없습니다.</p>
          ) : (
            filteredTodos.map((todo) => (
              <div 
                key={todo.id}
                className={clsx(
                  'group flex items-center justify-between gap-4 rounded-xl p-4 transition-colors',
                  todo.isCompleted ? 'bg-primary-light/40' : 'bg-[#FAFAFA]'
                )}
              >
                <div className="flex flex-1 items-center gap-4 overflow-hidden">
                  
                  {/* 체크박스 기능 제한 */}
                  <div 
                    onClick={() => !readOnly && onToggleTodo?.(todo.id)}
                    className={clsx(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors',
                      readOnly ? 'cursor-default' : 'cursor-pointer hover:border-primary',
                      todo.isCompleted ? 'border-primary bg-primary' : 'border-gray-300 bg-white'
                    )}
                  >
                    {todo.isCompleted && (
                      <Check className="h-4 w-4 text-white" strokeWidth={3} />
                    )}
                  </div>
                  
                  {editingTodoId === todo.id && !readOnly ? (
                    <form className="flex flex-1 items-center gap-2" onSubmit={(e) => handleSaveEdit(e, todo.id)}>
                      <TextField value={editTodoText} onChange={(e) => setEditTodoText(e.target.value)} autoFocus />
                      <Button type="submit" className="h-[42px] px-4 text-xs">저장</Button>
                      <Button type="button" variant="secondary" onClick={() => setEditingTodoId(null)} className="h-[42px] px-4 text-xs">취소</Button>
                    </form>
                  ) : (
                    <span 
                      className={clsx(
                        'truncate text-sm font-medium transition-all',
                        todo.isCompleted ? 'text-text-muted line-through' : 'text-text'
                      )}
                    >
                      {todo.text}
                    </span>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className={clsx("rounded px-2.5 py-1 text-xs font-medium transition-opacity", todo.isCompleted ? "opacity-60 text-text-muted" : "text-primary")}>
                    {todo.category}
                  </span>
                  
                  {/* 수정/삭제 버튼 숨김 처리 */}
                  {!readOnly && (
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button type="button" onClick={() => { setEditingTodoId(todo.id); setEditTodoText(todo.text); }} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4f4f4] text-[#8e8e8e] transition-colors hover:bg-gray-200">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => onDeleteTodo?.(todo.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#F04444] transition-colors hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </BaseCard>
        </>
      )}
    </div>
  );
}