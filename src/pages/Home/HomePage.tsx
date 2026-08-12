import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CircleDollarSign, ListChecks, CalendarDays, Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useDDay } from '../../contexts/DDayContext';
import { useSchedules } from '../Calendar/hooks/useSchedules';
import type { ScheduleItem } from '../Calendar/CalendarPage';
import ScheduleDetailModal from '../Calendar/components/ScheduleDetailModal';
import ScheduleModal from '../Calendar/components/ScheduleModal';
import { useBudget } from '../Budget/hooks/useBudget';
import { useChecklist } from '../Checklist/hooks/useChecklist';
import BaseCard from '../../components/ui/BaseCard';
import ProgressBar from '../../components/ui/ProgressBar';
import QuickMenu from './components/QuickMenu';

export default function HomePage() {
  const { user } = useAuth();
  const { dday } = useDDay();
  const navigate = useNavigate();
  const userName = user?.name ?? 'OOO';

  const [viewSchedule, setViewSchedule] = useState<ScheduleItem | null>(null);
  const [editSchedule, setEditSchedule] = useState<ScheduleItem | null>(null);

  const { schedules: rawSchedules, updateSchedule } = useSchedules();
  const schedules = user ? rawSchedules : [];
  const upcomingSchedules = [...schedules]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const { items: budgetItems, targetBudget } = useBudget();
  const totalPaid = budgetItems.reduce((acc, item) => acc + item.paidAmount, 0);
  const paidCount = budgetItems.filter((item) => item.isPaid).length;
  const totalCount = budgetItems.length;

  const { todos } = useChecklist();
  const completedCount = todos.filter((t) => t.isCompleted).length;
  const todoTotal = todos.length;

  return (
    <main className="flex flex-col gap-6">
      {/* 헤더 */}
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">{userName}님, 안녕하세요!</h1>
          <p className="mt-1 text-sm text-text-muted">WEDU와 함께 특별한 날을 준비해보세요</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-primary-light px-4 py-3">
          <div className="text-center">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">D-DAY</p>
            <p className="text-lg font-bold leading-tight text-text">
              {dday ? `D-${dday.daysRemaining}` : '미설정'}
            </p>
          </div>
          <Link
            to="/dday"
            className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-text no-underline shadow-sm hover:bg-gray-50"
          >
            {dday ? '상세보기' : '설정하기'}
          </Link>
        </div>
      </section>

      {/* 2×2 카드 그리드 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        {/* 예산 현황 */}
        <BaseCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light">
                <CircleDollarSign className="h-4 w-4 text-primary" strokeWidth={1.8} />
              </span>
              <h3 className="text-sm font-bold text-text">예산 현황</h3>
            </div>
            <Link to="/budget" className="text-xs font-medium text-primary no-underline hover:underline">
              전체보기
            </Link>
          </div>
          {user ? (
            <>
              <div className="mb-3">
                <ProgressBar value={totalPaid} max={targetBudget || 1} showLabel={false} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">전체 예산</span>
                  <span className="font-semibold text-text">{targetBudget.toLocaleString()}만원</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">집행 금액</span>
                  <span className="font-semibold text-text">{totalPaid.toLocaleString()}만원</span>
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  총 {totalCount}개 항목 · {paidCount}건 결제 완료
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="mb-3 text-sm text-text-muted">예산을 등록하면<br />지출 현황을 한눈에</p>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-primary hover:underline"
              >
                로그인하고 시작하기
              </button>
            </div>
          )}
        </BaseCard>

        {/* 체크리스트 */}
        <BaseCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light">
                <ListChecks className="h-4 w-4 text-primary" strokeWidth={1.8} />
              </span>
              <h3 className="text-sm font-bold text-text">체크리스트</h3>
            </div>
            <Link to="/checklist" className="text-xs font-medium text-primary no-underline hover:underline">
              전체보기
            </Link>
          </div>
          {user ? (
            <>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex-1">
                  <ProgressBar value={completedCount} max={todoTotal || 1} showLabel={false} />
                </div>
                <span className="shrink-0 text-sm font-bold text-text">{completedCount}/{todoTotal}</span>
              </div>
              <div className="flex flex-col gap-1.5">
                {todos.slice(0, 5).map((todo) => (
                  <div key={todo.id} className="flex items-center gap-2">
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
                        todo.isCompleted ? 'bg-amber-500' : 'border border-border bg-white'
                      }`}
                    >
                      {todo.isCompleted && (
                        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span
                      className={`truncate text-xs ${
                        todo.isCompleted ? 'text-text-muted line-through' : 'text-text'
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>
                ))}
                {todos.length > 5 && (
                  <p className="ml-6 text-xs text-text-muted">외 {todos.length - 5}개 항목</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="mb-3 text-sm text-text-muted">할 일을 등록하고<br />진행률을 확인하세요</p>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-primary hover:underline"
              >
                로그인하고 시작하기
              </button>
            </div>
          )}
        </BaseCard>

        {/* 다가오는 일정 */}
        <BaseCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light">
                <CalendarDays className="h-4 w-4 text-primary" strokeWidth={1.8} />
              </span>
              <h3 className="text-sm font-bold text-text">다가오는 일정</h3>
            </div>
            <Link to="/calendar" className="text-xs font-medium text-primary no-underline hover:underline">
              전체보기
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {upcomingSchedules.length === 0 ? (
              <p className="py-6 text-center text-sm text-text-muted">예정된 일정이 없습니다.</p>
            ) : (
              upcomingSchedules.map((item) => {
                const [, month, day] = item.date.split('-');
                return (
                  <div
                    key={item.id}
                    onClick={() => setViewSchedule(item)}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-3 transition-colors hover:bg-primary-light/30"
                  >
                    <div className="flex min-w-10 flex-col items-center justify-center rounded-lg bg-primary-light px-2 py-1.5 text-primary">
                      <span className="text-[10px] font-semibold">{month}월</span>
                      <span className="text-base font-bold leading-none">{day}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text">{item.title}</p>
                      <p className="text-xs text-text-muted">{item.time}</p>
                    </div>
                    {item.category && (
                      <span className="shrink-0 rounded-full bg-primary-light/60 px-2 py-0.5 text-xs text-primary">
                        {item.category}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </BaseCard>

        {/* 프로포즈 스타일 */}
        <BaseCard className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light">
                <Heart className="h-4 w-4 text-primary" strokeWidth={1.8} />
              </span>
              <h3 className="text-sm font-bold text-text">프로포즈 스타일</h3>
            </div>
            {user?.onboardingCompleted && (
              <Link to="/onboarding/quiz" className="text-xs font-medium text-primary no-underline hover:underline">
                결과보기
              </Link>
            )}
          </div>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            {user?.onboardingCompleted ? (
              <>
                <p className="mb-3 text-sm text-text-muted">심리테스트가 완료되었어요</p>
                <Link
                  to="/onboarding/quiz"
                  className="text-sm font-semibold text-primary no-underline hover:underline"
                >
                  결과 다시 보기
                </Link>
              </>
            ) : (
              <>
                <p className="mb-3 text-sm text-text-muted">아직 심리테스트를 하지 않으셨어요</p>
                <Link
                  to="/onboarding"
                  className="text-sm font-semibold text-primary no-underline hover:underline"
                >
                  테스트 하러 가기
                </Link>
              </>
            )}
          </div>
        </BaseCard>
      </div>

      {/* 바로가기 */}
      <QuickMenu />

      {viewSchedule && (
        <ScheduleDetailModal
          schedule={viewSchedule}
          onClose={() => setViewSchedule(null)}
          onEdit={() => {
            setEditSchedule(viewSchedule);
            setViewSchedule(null);
          }}
        />
      )}

      {editSchedule && (
        <ScheduleModal
          initialData={editSchedule}
          onClose={() => setEditSchedule(null)}
          onSubmit={(updatedData) => {
            updateSchedule(editSchedule.id, updatedData);
            setEditSchedule(null);
          }}
        />
      )}
    </main>
  );
}
