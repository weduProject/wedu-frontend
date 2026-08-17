// src/pages/Checklist/ChecklistPage.tsx
import { useState, useEffect } from 'react';
import { Check, EyeOff, Lightbulb, X } from 'lucide-react';

import BaseCard from '../../components/ui/BaseCard';
import Button from '../../components/ui/Button';
import { useChecklist, RECOMMENDED_TODOS } from './hooks/useChecklist';
import { useAuth } from '../../contexts/AuthContext';
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal';
import EmptyState from '../../components/ui/EmptyState';
import ShareLinkCard from '../../components/ui/ShareLinkCard';
import ChecklistPageContent from './components/ChecklistPageContent';

export default function ChecklistPage() {
  const { user, isLoading: authIsLoading } = useAuth();

  const { todos:rawTodos, isLoading: checklistIsLoading, addTodo, toggleTodo, deleteTodo, updateTodo } = useChecklist();
  const todos = user ? rawTodos : [];

  const [showRecommendations, setShowRecommendations] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);

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

  if (authIsLoading || checklistIsLoading) {
    return <p className="py-20 text-center text-sm text-text-muted">불러오는 중...</p>
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* 헤더 영역 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-text md:text-3xl">체크리스트</h2>
        <p className="mt-2 text-sm text-text-muted">웨딩 준비, 하나씩 체크하며 완벽하게</p>
      </div>

      {user && (
        <>
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
      </>
      )}

      <ChecklistPageContent
        todos={todos}
        fallbackUI={
          !user ? (
            <EmptyState
              icon={Check}
              title="할 일을 등록하고 진행률을 확인하세요"
              description="로그인 후 카테고리별로 할 일을 관리할 수 있습니다."
            />
          ) : undefined
        }
        onToggleTodo={toggleTodo}
        onAddTodo={(text, category) => addTodo(text, category)}
        onUpdateTodo={(id, text) => updateTodo(id, text)}
        onDeleteTodo={(id) => setTodoToDelete(id)}
      />

      {user && (
        <ShareLinkCard pageName="체크리스트" sharePath="/shared/checklist" />
      )}

      <ConfirmDeleteModal 
        isOpen={!!todoToDelete}
        onClose={() => setTodoToDelete(null)}
        onConfirm={() => {
          if (todoToDelete) {
            deleteTodo(todoToDelete);
            setTodoToDelete(null);
          }
        }}
      />
    </div>
  );
}