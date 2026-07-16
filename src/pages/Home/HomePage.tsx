import { useAuth } from '../../contexts/AuthContext';
import DdayCard from './components/DdayCard';
import BudgetCard from './components/BudgetCard';
import ChecklistSummaryCard from './components/ChecklistSummaryCard';
import QuickMenu from './components/QuickMenu';
import UpcomingSchedule from './components/UpcomingSchedule';

export default function HomePage() {
  const { user } = useAuth();
  const userName = user?.name ?? 'OOO';

  return (
    <main className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl">안녕하세요, {userName}님!</h1>
      </section>

      <section>
        <h2 className="text-base text-text-muted mb-3">이번 달 준비 현황</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <DdayCard />
          <BudgetCard />
          <ChecklistSummaryCard />
        </div>
      </section>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <UpcomingSchedule />
        </div>
        <div className="col-span-2">
          <QuickMenu />
        </div>
      </div>
    </main>
  );
}
