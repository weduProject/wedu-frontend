import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
  'block px-3 py-2.5 text-sm text-left rounded-lg no-underline transition-colors hover:bg-primary/[.08]';

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideNav({ isOpen, onClose }: SideNavProps) {
  const { user } = useAuth();

  return (
    <>
      {/* 모바일 백드롭 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 본체 */}
      <nav
        aria-label="메인 메뉴"
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-[220px] bg-primary-light border-r border-border p-6 flex flex-col transition-transform duration-300',
          'lg:static lg:translate-x-0 lg:shrink-0 lg:h-screen lg:sticky lg:top-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <Link to={user ? '/home' : '/'} className="text-primary text-xl font-bold no-underline">WEDU</Link>
          <button
            type="button"
            className="lg:hidden bg-transparent border-0 text-text-muted text-xl cursor-pointer"
            onClick={onClose}
            aria-label="메뉴 닫기"
          >
            ✕
          </button>
        </div>
        <ul className="flex flex-col list-none gap-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
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
    </>
  );
}
