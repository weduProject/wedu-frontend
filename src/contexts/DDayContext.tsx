import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiFetch } from '../lib/apiClient';
import type { ApiEnvelope } from '../lib/apiClient';
import { useAuth } from './AuthContext';

// GET /api/ddays/me, POST /api/ddays, PATCH /api/ddays/me 공통 응답 (Swagger 확인: 2026-08-11)
interface DDayResponse {
  ddayId: number;
  weddingDate: string;   // "YYYY-MM-DD"
  targetAt: string;
  daysRemaining: number;
}

interface DDayContextValue {
  dday: DDayResponse | null;
  isLoading: boolean;
  createDDay: (weddingDate: string) => Promise<void>;
  updateDDay: (weddingDate: string) => Promise<void>;
}

const DDayContext = createContext<DDayContextValue | null>(null);

export function DDayProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [dday, setDday] = useState<DDayResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setDday(null);
      setIsLoading(false);
      return;
    }
    async function fetchDDay() {
      setIsLoading(true);
      try {
        const res = await apiFetch('/api/ddays/me');
        if (res.status === 404) { setDday(null); return; }
        const body: ApiEnvelope<DDayResponse> = await res.json();
        if (res.ok && body.success && body.data) setDday(body.data);
        else setDday(null);
      } catch {
        setDday(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDDay();
  }, [user]);

  async function createDDay(weddingDate: string): Promise<void> {
    const res = await apiFetch('/api/ddays', {
      method: 'POST',
      body: JSON.stringify({ weddingDate }),
    });
    const body: ApiEnvelope<DDayResponse> = await res.json();
    if (!res.ok || !body.success || !body.data) {
      throw new Error(body.error?.message ?? 'D-day 등록에 실패했어요.');
    }
    setDday(body.data);
  }

  async function updateDDay(weddingDate: string): Promise<void> {
    const res = await apiFetch('/api/ddays/me', {
      method: 'PATCH',
      body: JSON.stringify({ weddingDate }),
    });
    const body: ApiEnvelope<DDayResponse> = await res.json();
    if (!res.ok || !body.success || !body.data) {
      throw new Error(body.error?.message ?? 'D-day 수정에 실패했어요.');
    }
    setDday(body.data);
  }

  return (
    <DDayContext.Provider value={{ dday, isLoading, createDDay, updateDDay }}>
      {children}
    </DDayContext.Provider>
  );
}

export function useDDay() {
  const ctx = useContext(DDayContext);
  if (!ctx) throw new Error('useDDay must be used within DDayProvider');
  return ctx;
}
