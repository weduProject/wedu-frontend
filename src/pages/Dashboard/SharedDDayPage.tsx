// src/pages/DDay/SharedDDayPage.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../../lib/apiClient';
import DDayPageContent from './components/DDayPageContent';
import type { CategoryType, TodoItem } from '../Checklist/hooks/useChecklist';

const ENUM_TO_CATEGORY: Record<string, CategoryType> = {
  BASIC: '기본',
  CEREMONY: '예식',
  SHOOTING: '촬영',
  JEWELRY: '예물',
  HOUSING: '주거',
  TRAVEL: '여행',
};

export default function SharedDDayPage() {
  const { token } = useParams<{ token: string }>();
  const [targetDate, setTargetDate] = useState<string | null>(null);
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    if (!token) return;

    // ✨ 1. 디데이 공유 데이터 개별 호출
    const fetchSharedDDay = async () => {
      try {
        console.log(`[디데이 API 호출 시작] URL: /api/ddays/shared/${token}`);
        const res = await apiFetch(`/api/ddays/shared/${token}`);
        
        const body = await res.json();
        console.log("[디데이 API 응답 결과]:", body);

        // 스웨거 규격에 맞춘 명확한 파싱
        if (body.success && body.data?.weddingDate) {
          setTargetDate(body.data.weddingDate);
        }
      } catch (error) {
        console.error('[디데이 공유 데이터 로드 실패]:', error);
      }
    };

    // ✨ 2. 체크리스트 공유 데이터 개별 호출
    const fetchSharedChecklist = async () => {
      try {
        const res = await apiFetch(`/api/checklist-items/shared/${token}`);
        const body = await res.json();
        
        if (body.data?.items) {
          const rawItems = body.data.items;
          const mappedTodos: TodoItem[] = rawItems.map((item: any) => ({
            id: String(item.itemId),
            text: item.title,
            category: ENUM_TO_CATEGORY[item.category] || '기본',
            isCompleted: item.completed,
          }));
          setTodos(mappedTodos);
        }
      } catch (error) {
        console.error('[체크리스트 공유 데이터 로드 실패]:', error);
      }
    };

    // 두 함수를 독립적으로 실행 (하나가 실패해도 다른 하나는 정상 동작)
    fetchSharedDDay();
    fetchSharedChecklist();

  }, [token]);

  return (
    <div className="mx-auto max-w-5xl">
        <p className="pl-4 pb-4 text-sm text-text-muted">조회 전용 D-day 페이지입니다.</p>

      <DDayPageContent 
        targetDate={targetDate} 
        todos={todos} 
        readOnly={true} 
      />
    </div>
  );
}