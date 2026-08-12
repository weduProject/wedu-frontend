import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, CalendarDays, CheckCircle2, Circle, DollarSign, AlertCircle } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

interface DDayData {
  ddayId: number;
  weddingDate: string;
  daysRemaining: number;
}

interface BudgetItem {
  id: string;
  category: string;
  title: string;
  budgetAmount: number;
  paidAmount: number;
  isPaid: boolean;
}

interface ChecklistItem {
  id: string;
  text: string;
  category: string;
  isCompleted: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: string;
  memo?: string;
}

interface ShareData {
  dday: DDayData | null;
  budget: BudgetItem[];
  checklist: ChecklistItem[];
  events: CalendarEvent[];
}

async function fetchShared<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const body = await res.json();
  if (!body.success) throw new Error(body.error?.message ?? '오류가 발생했어요.');
  return body.data as T;
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

function formatMoney(amount: number) {
  return `${amount.toLocaleString()}만원`;
}

export default function SharePage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<ShareData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) { setError('유효하지 않은 링크예요.'); setIsLoading(false); return; }

    async function load() {
      setIsLoading(true);
      try {
        const [dday, budget, checklist, events] = await Promise.all([
          fetchShared<DDayData>(`/api/ddays/shared/${token}`).catch(() => null),
          fetchShared<BudgetItem[]>(`/api/budget-items/shared/${token}`),
          fetchShared<ChecklistItem[]>(`/api/checklist-items/shared/${token}`),
          fetchShared<CalendarEvent[]>(`/api/calendar-events/shared/${token}`),
        ]);
        setData({ dday, budget, checklist, events });
      } catch {
        setError('링크가 만료됐거나 유효하지 않아요.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA] px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-red-400" strokeWidth={1.8} />
          </div>
          <h1 className="text-lg font-bold text-text mb-2">링크를 열 수 없어요</h1>
          <p className="text-sm text-text-muted">{error ?? '알 수 없는 오류가 발생했어요.'}</p>
        </div>
      </div>
    );
  }

  const totalBudget = data.budget.reduce((s, i) => s + i.budgetAmount, 0);
  const paidBudget = data.budget.reduce((s, i) => s + i.paidAmount, 0);
  const completedCount = data.checklist.filter((i) => i.isCompleted).length;
  const upcomingEvents = [...data.events]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* 헤더 */}
      <div className="bg-white border-b border-border px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary fill-primary" strokeWidth={1.5} />
          <span className="text-base font-bold text-text">WEDU</span>
        </div>
        <span className="text-xs text-text-muted bg-gray-100 px-2.5 py-1 rounded-full">읽기 전용</span>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 flex flex-col gap-6">

        {/* D-day */}
        {data.dday && (
          <section className="rounded-2xl bg-gradient-to-br from-rose-300 via-pink-200 to-amber-100 p-6 text-white">
            <p className="text-xs tracking-[0.2em] uppercase font-medium text-white/80 mb-1">Wedding D-day</p>
            <h2 className="text-3xl font-bold mb-1">D-{data.dday.daysRemaining}</h2>
            <p className="text-sm text-white/80">{formatDate(data.dday.weddingDate)}</p>
          </section>
        )}

        {/* 예산 */}
        <section className="rounded-2xl bg-white border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-primary-light flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-primary" strokeWidth={1.8} />
            </div>
            <h3 className="text-base font-bold text-text">예산 현황</h3>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-text-muted">결제 완료</span>
            <span className="font-semibold text-text">{formatMoney(paidBudget)} / {formatMoney(totalBudget)}</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: totalBudget > 0 ? `${Math.min(100, (paidBudget / totalBudget) * 100)}%` : '0%' }}
            />
          </div>
          {data.budget.length > 0 && (
            <div className="mt-4 flex flex-col gap-2">
              {data.budget.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className={`text-sm ${item.isPaid ? 'text-text-muted line-through' : 'text-text font-medium'}`}>{item.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">{item.category}</p>
                  </div>
                  <span className={`text-sm font-semibold ${item.isPaid ? 'text-primary' : 'text-text-muted'}`}>
                    {formatMoney(item.budgetAmount)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 체크리스트 */}
        <section className="rounded-2xl bg-white border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-orange-500" strokeWidth={1.8} />
              </div>
              <h3 className="text-base font-bold text-text">체크리스트</h3>
            </div>
            <span className="text-xs text-text-muted">{completedCount} / {data.checklist.length} 완료</span>
          </div>
          <div className="flex flex-col gap-3">
            {data.checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                {item.isCompleted
                  ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" fill="currentColor" color="white" />
                  : <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                }
                <span className={`text-sm ${item.isCompleted ? 'text-text-muted line-through' : 'text-text'}`}>
                  {item.text}
                </span>
                <span className="ml-auto text-xs text-text-muted shrink-0">{item.category}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 캘린더 일정 */}
        <section className="rounded-2xl bg-white border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-blue-500" strokeWidth={1.8} />
            </div>
            <h3 className="text-base font-bold text-text">일정</h3>
          </div>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-text-muted">등록된 일정이 없어요.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="shrink-0 text-center">
                    <p className="text-xs text-text-muted">{event.date.slice(5).replace('-', '/')}</p>
                    <p className="text-xs text-text-muted">{event.time}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">{event.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">{event.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <p className="text-center text-xs text-text-muted pb-4">WEDU로 함께 웨딩을 준비하고 있어요 💍</p>
      </div>
    </div>
  );
}
