import { useNavigate } from 'react-router-dom';
import BaseCard from '../../../components/ui/BaseCard';

const PLACEHOLDER_ITEMS = [
  { date: 'MM/DD', label: '일정을 추가해보세요' },
  { date: 'MM/DD', label: '일정을 추가해보세요' },
  { date: 'MM/DD', label: '일정을 추가해보세요' },
];

export default function UpcomingSchedule() {
  const navigate = useNavigate();

  return (
    <BaseCard
      title="다가오는 일정"
      extra={
        <button
          type="button"
          className="text-xs text-primary hover:underline cursor-pointer bg-transparent border-0 p-0"
          onClick={() => navigate('/calendar')}
        >
          전체 일정 보기
        </button>
      }
    >
      <ul className="flex flex-col gap-2 mt-1">
        {PLACEHOLDER_ITEMS.map((item, i) => (
          <li key={i} className="flex items-center gap-3 text-sm">
            <span className="text-text-muted w-12 shrink-0">{item.date}</span>
            <span className="text-text-muted">{item.label}</span>
          </li>
        ))}
      </ul>
    </BaseCard>
  );
}
