// src/pages/Checklist/ChecklistPage.tsx
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Check, EyeOff, Lightbulb, Trash2, X } from 'lucide-react';

import BaseCard from '../../components/ui/BaseCard';
import ProgressBar from '../../components/ui/ProgressBar';
import TextField from '../../components/ui/TextField';
import Button from '../../components/ui/Button';
import { useChecklist, RECOMMENDED_TODOS, type CategoryType } from './hooks/useChecklist';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CATEGORY_TAB_ACTIVE, CATEGORY_TAB_INACTIVE } from '../../styles/categoryTab';

const CATEGORIES: CategoryType[] = ['기본', '예식', '촬영', '예물', '주거', '여행'];

export default function ChecklistPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { todos:rawTodos, addTodo, toggleTodo, deleteTodo } = useChecklist();
  const todos = user ? rawTodos : [];
  

  const [activeFilter, setActiveFilter] = useState<'전체' | CategoryType>('전체');
  
  const [inputText, setInputText] = useState('');
  const [inputCategory, setInputCategory] = useState<CategoryType>('기본');

  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    const hideRecommendations = localStorage.getItem('hideWeddingRecommendations');
    if (hideRecommendations !== 'true') {
      setShowRecommendations(true);
    }
  }, []);

  const handleCloseRecommendations = () => {
    setShowRecommendations(false);
  };

  const handleNeverShowRecommendations = () => {
    localStorage.setItem('hideWeddingRecommendations', 'true');
    setShowRecommendations(false);
  };

  // 진행률 계산
  const completedCount = todos.filter((todo) => todo.isCompleted).length;
  const totalCount = todos.length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  const remainingCount = totalCount - completedCount;

  const filteredTodos = todos.filter(
    (todo) => activeFilter === '전체' || todo.category === activeFilter
  );

  const handleToggleComplete = (id: string) => {
    toggleTodo(id);
  };

  const handleDeleteTodo = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteTodo(id);
  };

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    addTodo(inputText.trim(), inputCategory);
    setInputText('');
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* 헤더 영역 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text md:text-3xl">체크리스트</h2>
        <p className="mt-2 text-sm text-text-muted">웨딩 준비, 하나씩 체크하며 완벽하게</p>
      </div>

      {/* 웨딩 체크리스트 추천 UI 영역 */}
      {showRecommendations && (
        <BaseCard className="mb-8 p-6 shadow-sm md:p-8">
          <div className="mb-6 flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-bold text-text">추천 웨딩 체크리스트</h3>
          </div>
          
          {/* 카테고리별 추천 항목 그리드 */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Object.entries(RECOMMENDED_TODOS).map(([category, items]) => (
              <div key={category} className="rounded-xl p-4">
                <div className="mb-3 font-semibold text-primary">{category}</div>
                <ul className="flex flex-col gap-2 text-sm text-text">
                  {items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="mt-1.5 flex h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant='secondary'
              onClick={handleNeverShowRecommendations}
              className="flex items-center gap-1.5 border border-border bg-white text-text-muted hover:bg-gray-50 hover:text-text"
            >
              <EyeOff className="h-4 w-4" />
              다시 보지 않기
            </Button>
            <Button onClick={handleCloseRecommendations} className="flex items-center gap-1.5">
              <X className="h-4 w-4" />
              닫기
            </Button>
          </div>
        </BaseCard>
      )}

      {/* 1. 진행률 카드 (BaseCard 적용) */}
      <BaseCard className="mb-6 p-6 shadow-sm md:p-8">
        <div className="mb-3 flex items-end justify-between">
          <span className="text-sm font-semibold text-text md:text-base">전체 진행률</span>
          <span className="text-2xl font-bold text-primary md:text-3xl">{progressPercentage}%</span>
        </div>
        
        <div className="mb-3">
          <ProgressBar value={completedCount} max={totalCount} showLabel={false} />
        </div>
        
        <div className="flex items-center justify-between text-xs font-medium text-text-muted md:text-sm">
          <span>{completedCount}개 완료</span>
          <span>{remainingCount}개 남음</span>
        </div>
      </BaseCard>

      {/* 비회원일 때 보여줄 빈 화면 멘트 */}
      {!user && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light/50">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-text">할 일을 등록하고 진행률을 확인하세요</h3>
          <p className="mb-6 text-sm text-text-muted">로그인 후 카테고리별로 할 일을 관리할 수 있습니다.</p>
          <Button onClick={() => navigate('/login')} className="px-6">
            로그인하러 가기
          </Button>
        </div>
      )}

      {user && (
        <>
        {/* 2. 할 일 추가 폼 */}
        <form onSubmit={handleAddTodo} className="mb-6 flex items-start gap-3">
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
          
          <Button
            type="submit"
            disabled={!inputText.trim()}
            className="h-10.5 min-w-20"
          >
            추가
          </Button>
        </form>

        {/* 3. 카테고리 필터 칩 */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter('전체')}
            className={clsx(
              'cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors',
              activeFilter === '전체' ? CATEGORY_TAB_ACTIVE : CATEGORY_TAB_INACTIVE,
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
                activeFilter === cat ? CATEGORY_TAB_ACTIVE : CATEGORY_TAB_INACTIVE,
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4. 체크리스트 목록 영역 */}
        <BaseCard className="p-6 shadow-sm">
          <div className="flex flex-col gap-3">
            {filteredTodos.length === 0 ? (
              <p className="py-10 text-center text-sm text-text-muted">해당 카테고리에 등록된 할 일이 없습니다.</p>
            ) : (
              filteredTodos.map((todo) => (
                <div 
                  key={todo.id}
                  onClick={() => handleToggleComplete(todo.id)}
                  className={clsx(
                    'group flex cursor-pointer items-center justify-between gap-4 rounded-xl p-4 transition-colors',
                    todo.isCompleted ? 'bg-primary-light/40' : 'bg-[#FAFAFA] hover:bg-primary-light/20'
                  )}
                >
                  <div className="flex flex-1 items-center gap-4 overflow-hidden">
                    {/* 커스텀 체크박스 */}
                    <div 
                      className={clsx(
                        'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors',
                        todo.isCompleted 
                          ? 'border-primary bg-primary' 
                          : 'border-gray-300 bg-white group-hover:border-primary'
                      )}
                    >
                      {todo.isCompleted && (
                        <Check className="h-4 w-4 text-white" strokeWidth={3} />
                      )}
                    </div>
                    
                    {/* 텍스트 영역 */}
                    <span 
                      className={clsx(
                        'truncate text-sm font-medium transition-all',
                        todo.isCompleted ? 'text-text-muted line-through' : 'text-text'
                      )}
                    >
                      {todo.text}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span 
                      className={clsx(
                        "rounded px-2.5 py-1 text-xs font-medium transition-opacity",
                        todo.isCompleted ? "opacity-60 text-text-muted" : "text-primary"
                      )}
                    >
                      {todo.category}
                    </span>
                    
                    <button
                      type="button"
                      onClick={(e) => handleDeleteTodo(e, todo.id)}
                      className="flex h-8 w-8 items-center justify-center rounded text-text-muted transition-colors hover:bg-red-50 hover:text-red-500"
                      aria-label="할 일 삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
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