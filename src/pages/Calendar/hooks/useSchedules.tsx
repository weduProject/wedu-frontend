import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { ScheduleItem } from '../CalendarPage';
import { apiFetch, getToken } from '../../../lib/apiClient';

interface ScheduleContextType {
  schedules: ScheduleItem[];
  isLoading: boolean;
  addSchedule: (newSchedule: Omit<ScheduleItem, 'id'>) => void;
  deleteSchedule: (id: string) => void;
  updateSchedule: (id: string, data: Partial<ScheduleItem>) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchedules = useCallback(async () => {
    // 로그인 안 된 상태면 API 호출 자체를 스킵 (불필요한 401 방지)
    if (!getToken()) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiFetch('/api/calendar-event');
      if (!res.ok) throw new Error('데이터 로드 실패');
      const data = await res.json();
      setSchedules(data);
    } catch (error) {
      console.warn('API 호출 실패, 임시 더미데이터를 유지합니다.', error);
      setSchedules([
        { id: '1', title: '드레스 2차 피팅', date: '2026-07-12', time: '14:00', category: '스튜디오/드레스', memo: '' },
        { id: '2', title: '웨딩밴드 픽업', date: '2026-07-20', time: '13:30', category: '예물/예단', memo: '종로 웨듀다이아' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const addSchedule = async (newSchedule: Omit<ScheduleItem, 'id'>) => {
    const tempId = String(Date.now());
    const addedItem = { ...newSchedule, id: tempId };
    setSchedules((prev) => [...prev, addedItem]);

    try {
      await apiFetch('/api/calendar-event', {
        method: 'POST',
        body: JSON.stringify(newSchedule),
      });
    } catch (error) {
      console.error('일정 추가 에러:', error);
    }
  };

  const deleteSchedule = async (id: string) => {
    setSchedules((prev) => prev.filter((item) => item.id !== id));

    try {
      await apiFetch(`/api/calendar-event/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error('일정 삭제 에러:', error);
    }
  };

  const updateSchedule = async (id: string, updatedData: Partial<ScheduleItem>) => {
    setSchedules((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );

    try {
      // TODO: 백엔드 API 연동 시 주석 해제
      // await apiFetch(`/api/calendar-event/${id}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify(updatedData),
      // });
    } catch (error) {
      console.error('일정 수정 에러:', error);
    }
  };

  return (
    <ScheduleContext.Provider value={{ schedules, isLoading, addSchedule, deleteSchedule, updateSchedule }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedules() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedules는 ScheduleProvider 안에서 사용되어야 합니다.');
  }
  return context;
}
