import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const NAV_ITEMS = [
  { label: '홈', path: '/home' },
  { label: '프로포즈 편집샵', path: '/shop' },
  { label: '나만의 프로포즈', path: '/builder-start' },
  { label: '체크리스트', path: '/checklist' },
  { label: '캘린더/일정', path: '/calendar' },
  { label: '예산 관리', path: '/budget' },
  { label: '커뮤니티', path: '/community' },
  { label: '마이페이지', path: '/mypage' },
] as const;

const navLinkBase =
  'block px-2 py-2 text-[13px] text-center rounded-lg no-underline transition-colors hover:bg-primary/[.08] md:px-3 md:py-2.5 md:text-sm md:text-left';

export default function SideNav() {
  return (
    <nav
      aria-label="메인 메뉴"
      className="order-2 sticky bottom-0 w-full bg-primary-light border-t border-border px-4 py-2 md:order-none md:w-[220px] md:shrink-0 md:h-screen md:sticky md:top-0 md:bottom-auto md:border-r md:border-t-0 md:p-6"
    >
      <h1 className="hidden md:block text-primary text-xl mb-6">WEDU</h1>
      <ul className="flex justify-around list-none md:block">
        {NAV_ITEMS.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                clsx(navLinkBase, isActive ? 'bg-primary/[.15] text-primary font-semibold' : 'text-text')
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
