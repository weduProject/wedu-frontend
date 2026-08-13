import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { apiFetch, getToken } from '../../../lib/apiClient';
import type { ApiEnvelope } from '../../../lib/apiClient';
import type { DDayData } from '../types/dday';

export function useDDay() {
  const { user } = useAuth();
  const [targetDate, setTargetDate] = useState<string | null>(null);
  const [hasDDay, setHasDDay] = useState(false);

  const fetchDDayInfo = useCallback(async () => {
    if (!user || !getToken()) {
      setTargetDate(null);
      setHasDDay(false);
      return;
    }

    try {
      const response = await apiFetch('/api/ddays/me');
      if (response.ok) {
        const result: ApiEnvelope<DDayData> = await response.json();
        
        if (result.success && result.data) {
          setTargetDate(result.data.weddingDate);
          setHasDDay(true);
        } else {
          setTargetDate(null);
          setHasDDay(false);
        }
      } else {
        setTargetDate(null);
        setHasDDay(false);
      }
    } catch (error) {
      console.error("D-Day 불러오기 실패:", error);
      setTargetDate(null);
      setHasDDay(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDDayInfo();
  }, [fetchDDayInfo]);

  const saveDDay = async (newDate: string): Promise<boolean> => {
    try {
      const url = hasDDay ? '/api/ddays/me' : '/api/ddays';
      const method = hasDDay ? 'PATCH' : 'POST';

      const response = await apiFetch(url, {
        method,
        body: JSON.stringify({ weddingDate: newDate }),
      });

      if (response.ok) {
        const result: ApiEnvelope<DDayData> = await response.json();
        if (result.success) {
          setTargetDate(newDate);
          setHasDDay(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("D-Day 저장 실패:", error);
      return false;
    }
  };

  return { targetDate, hasDDay, fetchDDayInfo, saveDDay };
}