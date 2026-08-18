// src/pages/Checklist/SharedChecklistPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import ChecklistPageContent from './components/ChecklistPageContent';
import type { TodoItem, CategoryType } from './hooks/useChecklist';

const ENUM_TO_CATEGORY: Record<string, CategoryType> = {
  BASIC: '기본',
  CEREMONY: '예식',
  SHOOTING: '촬영',
  JEWELRY: '예물',
  HOUSING: '주거',
  TRAVEL: '여행',
};

export default function SharedChecklistPage() {
  const { token } = useParams<{ token: string }>();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchSharedChecklist = async () => {
      try {
        const res = await apiFetch(`/api/checklist-items/shared/${token}`);

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }

        const body = await res.json();
        const rawItems = body.data?.items || [];
        
        const mappedTodos: TodoItem[] = rawItems.map((item: any) => ({
          id: String(item.itemId),
          text: item.title,
          category: ENUM_TO_CATEGORY[item.category] || '기본',
          isCompleted: item.completed,
        }));

        setTodos(mappedTodos);
      } catch (err) {
        console.error('공유 체크리스트 로드 실패:', err);
      } finally {
        setIsLoading(false);
      } 
    };

    fetchSharedChecklist();
  }, [token]);

  if (isLoading) return <p className="py-20 text-center text-sm text-text-muted">불러오는 중...</p>;

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h2 className="md:text-3xl mb-2 text-2xl font-bold font-serif text-text">공유된 웨딩 체크리스트</h2>
        <p className="text-sm text-text-muted">조회 전용 페이지입니다.</p>
      </div>

      <ChecklistPageContent todos={todos} readOnly={true} />
    </div>
  );
}
