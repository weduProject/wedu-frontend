import { useNavigate } from 'react-router-dom';
import { Heart, CalendarCheck, ListChecks, DollarSign, MessageCircle, User } from 'lucide-react';

const MENU_ITEMS = [
  { label: '프로포즈', path: '/shop', Icon: Heart },
  { label: 'D-DAY', path: '/dday', Icon: CalendarCheck },
  { label: '체크리스트', path: '/checklist', Icon: ListChecks },
  { label: '예산', path: '/budget', Icon: DollarSign },
  { label: '커뮤니티', path: '/community', Icon: MessageCircle },
  { label: '마이페이지', path: '/mypage', Icon: User },
] as const;

export default function QuickMenu() {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="mb-3 text-base font-bold text-text">바로가기</h2>
      <div className="flex gap-2">
        {MENU_ITEMS.map(({ path, label, Icon }) => (
          <button
            key={path}
            type="button"
            onClick={() => navigate(path)}
            className="flex flex-1 flex-col items-center gap-2 rounded-xl border border-border bg-white py-4 transition-colors hover:border-primary/40 cursor-pointer"
          >
            <Icon className="h-5 w-5 text-text-muted" strokeWidth={1.5} />
            <span className="text-xs text-text-muted">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
