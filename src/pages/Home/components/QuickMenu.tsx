import { useNavigate } from 'react-router-dom';

const MENU_ITEMS = [
  { label: '나만의 프로포즈', path: '/builder', emoji: '💍' },
  { label: '체크리스트', path: '/checklist', emoji: '✅' },
  { label: '캘린더/일정', path: '/calendar', emoji: '📅' },
  { label: '예산 관리', path: '/budget', emoji: '💰' },
] as const;

export default function QuickMenu() {
  const navigate = useNavigate();

  return (
    <section>
      <h2 className="text-base text-text-muted mb-3">빠른 메뉴</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-border hover:border-primary/40 transition-colors cursor-pointer"
          >
            <span className="text-2xl">{item.emoji}</span>
            <span className="text-xs text-text text-center leading-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
