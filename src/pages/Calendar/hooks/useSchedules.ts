import { useState, useEffect, useCallback } from 'react';
import type { ScheduleItem } from '../CalendarPage';

export function useSchedules() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. READ
  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: 실제 백엔드 API 주소로 변경
      const res = await fetch('/api/schedules'); 
      if (!res.ok) throw new Error('데이터 로드 실패');
      const data = await res.json();
      setSchedules(data);
    } catch (error) {
      console.warn('API 호출 실패, 임시 더미데이터를 유지합니다.', error);
      // 백엔드 미연결 시 UI 테스트를 위한 더미 데이터
      setSchedules([
        { id: '1', title: '드레스 2차 피팅', date: '2026-07-12', time: '14:00', category: '스튜디오/드레스', memo: '' },
        { id: '2', title: '웨딩밴드 픽업', date: '2026-07-20', time: '13:30', category: '예물/예단', memo: '종로 웨듀다이아' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. CREATE
  const addSchedule = async (newSchedule: Omit<ScheduleItem, 'id'>) => {
    // 프론트 단에서 즉시 UI 업데이트 (Optimistic UI)
    const tempId = String(Date.now());
    const addedItem = { ...newSchedule, id: tempId };
    setSchedules((prev) => [...prev, addedItem]);

    try {
      await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSchedule),
      });
      // 성공 시 서버 데이터로 다시 동기화
      // fetchSchedules(); 
    } catch (error) {
      console.error('일정 추가 에러:', error);
    }
  };

  // 3. DELETE
  const deleteSchedule = async (id: string) => {
    // 프론트 단에서 즉시 제거
    setSchedules((prev) => prev.filter((item) => item.id !== id));

    try {
      await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('일정 삭제 에러:', error);
    }
  };

  // 4. UPDATE
    const updateSchedule = async (id: string, updatedData: Partial<ScheduleItem>) => {
    // 프론트 단에서 즉시 UI 업데이트
    setSchedules((prev) => 
        prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );

    try {
        // TODO: 백엔드 API 연동 시 주석 해제
        // await fetch(`/api/schedules/${id}`, {
        //   method: 'PATCH',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(updatedData),
        // });
    } catch (error) {
        console.error('일정 수정 에러:', error);
    }
    };

  // 초기 렌더링 시 데이터 로드
  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  return {
    schedules,
    isLoading,
    addSchedule,
    deleteSchedule,
    updateSchedule
  };
}