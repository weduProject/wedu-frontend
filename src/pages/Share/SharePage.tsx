import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, CheckCircle2, Circle, DollarSign, AlertCircle, Clock } from 'lucide-react';
import weduLogo from '../../assets/wedu-logo.png';
import ProgressBar from '../../components/ui/ProgressBar';
import BaseCard from '../../components/ui/BaseCard';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

const ENUM_TO_BUDGET_CATEGORY: Record<string, string> = {
  VENUE: '웨딩홀/예식장',
  STUDIO_DRESS: '스튜디오/드레스',
  HONEYMOON: '허니문',
  JEWELRY_GIFTS: '예물/예단',
  OTHER: '기타',
};

const ENUM_TO_CHECKLIST_CATEGORY: Record<string, string> = {
  BASIC: '기본',
  CEREMONY: '예식',
  SHOOTING: '촬영',
  JEWELRY: '예물',
  HOUSING: '주거',
  TRAVEL: '여행',
};

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
}

interface DDayData {
  ddayId: number;
  weddingDate: string;
  daysRemaining: number;
}

interface ShareData {
  dday: DDayData | null;
  budget: BudgetItem[];
  targetBudget: number;
  checklist: ChecklistItem[];
  events: CalendarEvent[];
}

async function apiFetch(path: string) {
  const res = await fetch(`${BASE_URL}${path}`);
  const body = await res.json();
  if (res.status === 404 && body?.error?.code === 'SHARE_LINK_404') {
    throw new Error('INVALID_TOKEN');
  }
  if (!res.ok || !body.success) return null;
  return body.data;
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
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!token) { setError('유효하지 않은 링크예요.'); setIsLoading(false); return; }

    async function load() {
      setIsLoading(true);
      try {
        // 캘린더: 현재 월 + 다음 2개월 병렬 조회
        const now = new Date();
        const months = [0, 1, 2].map((offset) => {
          const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
          return { year: d.getFullYear(), month: d.getMonth() + 1 };
        });

        const [ddayRaw, budgetRaw, checklistRaw, ...calendarRaws] = await Promise.all([
          apiFetch(`/api/ddays/shared/${token}`).catch(() => null),
          apiFetch(`/api/budget-items/shared/${token}`).catch(() => null),
          apiFetch(`/api/checklist-items/shared/${token}`).catch(() => null),
          ...months.map(({ year, month }) =>
            apiFetch(`/api/calendar-events/shared/${token}?year=${year}&month=${month}`).catch(() => null)
          ),
        ]);

        // 예산: categories[].items[] 플랫
        const budget: BudgetItem[] = (budgetRaw?.categories ?? []).flatMap(
          (cat: { category: string; items: { itemId: number; title: string; plannedAmount: number; spentAmount: number; completed: boolean }[] }) =>
            (cat.items ?? []).map((item) => ({
              id: String(item.itemId),
              category: ENUM_TO_BUDGET_CATEGORY[cat.category] ?? cat.category,
              title: item.title,
              budgetAmount: item.plannedAmount ?? 0,
              paidAmount: item.spentAmount ?? 0,
              isPaid: item.completed ?? false,
            }))
        );

        // 체크리스트: data.items[]
        const checklist: ChecklistItem[] = (checklistRaw?.items ?? []).map(
          (item: { itemId: number; title: string; category: string; completed: boolean }) => ({
            id: String(item.itemId),
            text: item.title,
            category: ENUM_TO_CHECKLIST_CATEGORY[item.category] ?? item.category,
            isCompleted: item.completed,
          })
        );

        // 캘린더: 3개월 합치고 정렬
        const events: CalendarEvent[] = calendarRaws
          .flatMap((raw) =>
            Array.isArray(raw)
              ? raw.map((ev: { eventId: number; title: string; eventDate: string; eventAt: string; category: string }) => ({
                  id: String(ev.eventId),
                  title: ev.title,
                  date: ev.eventDate,
                  time: ev.eventAt?.split('T')[1]?.slice(0, 5) ?? '',
                  category: ENUM_TO_BUDGET_CATEGORY[ev.category] ?? ev.category,
                }))
              : []
          )
          .sort((a, b) => a.date.localeCompare(b.date));

        setData({ dday: ddayRaw, budget, targetBudget: budgetRaw?.totalBudget ?? 0, checklist, events });
      } catch (e) {
        if (e instanceof Error && e.message === 'INVALID_TOKEN') {
          setIsExpired(true);
        } else {
          setError('데이터를 불러오는 중 오류가 발생했어요.');
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
        <div className="bg-white border-b border-border px-4 py-4 flex items-center gap-2 sticky top-0 z-50">
          <img src={weduLogo} alt="WEDU" className="h-10 w-10 object-contain" />
          <span className="text-2xl font-bold text-rosegold">WEDU</span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (isExpired || error || !data) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
        <div className="bg-white border-b border-border px-4 py-4 flex items-center gap-2 sticky top-0 z-50">
          <img src={weduLogo} alt="WEDU" className="h-10 w-10 object-contain" />
          <span className="text-2xl font-bold text-rosegold">WEDU</span>
        </div>
        <div className="flex flex-1 items-center justify-center px-4">
          {isExpired ? (
            <BaseCard className="py-10 px-12 mx-auto">
              <div className="flex flex-col items-center gap-4">
                <Clock className="w-10 h-10 text-text-muted" strokeWidth={1.5} />
                <p className="text-base font-semibold text-text">Link Expired</p>
              </div>
            </BaseCard>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-400" strokeWidth={1.8} />
              </div>
              <h1 className="text-lg font-bold text-text mb-2">링크를 열 수 없어요</h1>
              <p className="text-sm text-text-muted">{error ?? '알 수 없는 오류가 발생했어요.'}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  const isEmpty = !data.dday && data.budget.length === 0 && data.checklist.length === 0 && data.events.length === 0;

  if (isEmpty) {
    return (
      <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
        <div className="bg-white border-b border-border px-4 py-4 flex items-center gap-2 sticky top-0 z-50">
          <img src={weduLogo} alt="WEDU" className="h-10 w-10 object-contain" />
          <span className="text-2xl font-bold text-rosegold">WEDU</span>
        </div>
        <div className="flex flex-1 items-center justify-center px-4">
          <BaseCard className="py-10 px-12 mx-auto">
            <div className="flex flex-col items-center gap-4">
              <Clock className="w-10 h-10 text-text-muted" strokeWidth={1.5} />
              <p className="text-base font-semibold text-text">Link Expired</p>
            </div>
          </BaseCard>
        </div>
      </div>
    );
  }

  const totalBudget = data.targetBudget;
  const paidBudget = data.budget.filter(i => i.isPaid).reduce((s, i) => s + (i.paidAmount || i.budgetAmount), 0);
  const completedCount = data.checklist.filter((i) => i.isCompleted).length;

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      {/* 커스텀 헤더 */}
      <div className="bg-white border-b border-border px-4 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={weduLogo} alt="WEDU" className="h-10 w-10 object-contain" />
          <span className="text-2xl font-bold text-rosegold">WEDU</span>
        </div>
        <span className="text-xs text-text-muted bg-gray-100 px-2.5 py-1 rounded-full">읽기 전용</span>
      </div>

      <main className="flex-1 p-5 md:p-8">
      <div className="mx-auto max-w-2xl flex flex-col gap-6">

        {/* D-day */}
        {data.dday && (
          <section className="h-36 flex flex-col justify-center rounded-2xl gradient-primary-bg p-6 text-white">
            <p className="text-xs tracking-[0.2em] uppercase font-medium text-white/80 mb-1">Wedding D-day</p>
            <h2 className="text-3xl font-bold mb-2">D-{data.dday.daysRemaining}</h2>
            <p className="text-sm text-white/80">{formatDate(data.dday.weddingDate)}</p>
          </section>
        )}

        {/* 예산 */}
        <section className="rounded-2xl bg-white border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary-light flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary" strokeWidth={1.8} />
              </div>
              <h3 className="text-base font-bold text-text">예산 현황</h3>
            </div>
            {data.budget.length > 0 && (
              <div className="text-right">
                <p className="text-xs text-text-muted">전체 예산 <span className="font-semibold text-text">{formatMoney(totalBudget)}</span></p>
                <p className="text-xs text-text-muted">사용 <span className="font-semibold text-primary">{formatMoney(paidBudget)}</span></p>
                <p className="text-xs text-text-muted">잔여 <span className="font-semibold text-text">{formatMoney(totalBudget - paidBudget)}</span></p>
              </div>
            )}
          </div>
          {data.budget.length === 0 ? (
            <p className="text-sm text-text-muted">등록된 예산 항목이 없어요.</p>
          ) : (
            <>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-text-muted">결제 완료</span>
                <span className="font-semibold text-text">{formatMoney(paidBudget)} / {formatMoney(totalBudget)}</span>
              </div>
              <ProgressBar value={paidBudget} max={totalBudget} />
              <div className="mt-4 flex flex-col gap-2">
                {data.budget.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p
                        className={`text-sm ${item.isPaid ? 'text-text-muted' : 'text-text font-medium'}`}
                        style={item.isPaid ? { textDecoration: 'line-through', textDecorationThickness: '2px' } : undefined}
                      >{item.title}</p>
                      <p className="text-xs text-text-muted mt-0.5">{item.category}</p>
                    </div>
                    <span className={`text-sm font-semibold ${item.isPaid ? 'text-primary' : 'text-text-muted'}`}>
                      {formatMoney(item.isPaid ? (item.paidAmount || item.budgetAmount) : item.budgetAmount)}
                    </span>
                  </div>
                ))}
              </div>
            </>
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
          {data.checklist.length === 0 ? (
            <p className="text-sm text-text-muted">등록된 항목이 없어요.</p>
          ) : (
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
          )}
        </section>

        {/* 캘린더 일정 */}
        <section className="rounded-2xl bg-white border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <CalendarDays className="w-4 h-4 text-blue-500" strokeWidth={1.8} />
            </div>
            <h3 className="text-base font-bold text-text">일정</h3>
          </div>
          {data.events.length === 0 ? (
            <p className="text-sm text-text-muted">등록된 일정이 없어요.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.events.map((event) => (
                <div key={event.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="shrink-0 text-center min-w-[40px]">
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
      </main>
    </div>
  );
}
