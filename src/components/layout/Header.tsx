import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, ChevronDown, Sparkles, CreditCard, ListChecks, Calendar, User } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../pages/Shop/utils/useWishlist';
import { useCart } from '../../pages/Shop/CartContext';

const PRIMARY_LINKS = [
  { label: '홈', path: '/home' },
  { label: '심리테스트', path: '/onboarding/quiz' },
  { label: '프로포즈 플래닝', path: '/shop' },
  { label: '커뮤니티', path: '/community' },
] as const;

const TOOL_LINKS = [
  { label: '나만의 프로포즈', path: '/builder-start', Icon: Sparkles },
  { label: 'D-day 관리', path: '/dday', Icon: Heart },
  { label: '예산 관리', path: '/budget', Icon: CreditCard },
  { label: '체크리스트', path: '/checklist', Icon: ListChecks },
  { label: '캘린더 일정', path: '/calendar', Icon: Calendar },
  { label: '마이페이지', path: '/mypage', Icon: User },
] as const;

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'text-sm font-medium no-underline transition-colors',
    isActive ? 'font-semibold text-primary' : 'text-[#3E3939] hover:text-primary',
  );

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setIsToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    setIsMobileOpen(false);
    navigate('/');
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/40 shadow-[0px_1px_0px_rgba(232,121,108,0.18)] backdrop-blur transition-all duration-500">
      <div className="relative mx-auto flex h-16 max-w-360 items-center gap-6 px-4 md:h-20 md:px-8">
        <Link
          to={user ? '/home' : '/'}
          className="shrink-0 bg-[linear-gradient(90deg,#F79689_0%,#C4675D_100%)] bg-clip-text text-[30px] font-bold leading-9 tracking-[-0.75px] text-transparent no-underline"
        >
          WEDU
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-6 lg:flex" aria-label="주 메뉴">
          {PRIMARY_LINKS.map((item) => (
            <NavLink key={item.path} to={item.path} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}

          <span className="h-5 w-px bg-[rgba(171,162,161,0.4)]" aria-hidden />

          <div ref={toolsRef} className="relative">
            <button
              type="button"
              onClick={() => setIsToolsOpen((prev) => !prev)}
              aria-expanded={isToolsOpen}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-[#3E3939] transition-colors hover:text-primary"
            >
              관리도구
              <ChevronDown
                className={clsx('h-4 w-4 transition-transform', isToolsOpen && 'rotate-180')}
                strokeWidth={1.8}
              />
            </button>

            {isToolsOpen && (
              <div className="absolute left-0 top-full mt-2 w-52 rounded-xl border border-border bg-white p-1.5 shadow-lg">
                {TOOL_LINKS.map(({ label, path, Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() => setIsToolsOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'group flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm no-underline transition-colors',
                        isActive
                          ? 'bg-primary-light font-semibold text-primary'
                          : 'text-text hover:bg-primary-light hover:text-primary',
                      )
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <>
              <HeaderIconButtons />
              <span className="hidden text-sm font-medium text-[#3E3939] sm:inline">{user.name}님</span>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden rounded-full bg-[linear-gradient(111.47deg,#F79689_0%,#E8796C_33.33%,#FEABA0_66.67%,#E8796C_100%)] px-5 py-2 text-sm font-medium text-white shadow-[0px_4px_14px_rgba(161,86,77,0.18),0px_0px_24px_rgba(232,121,108,0.28),inset_0px_1px_0px_rgba(255,255,255,0.2)] transition-opacity hover:opacity-90 sm:inline"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="hidden bg-transparent text-sm font-semibold text-primary transition-opacity hover:opacity-80 sm:inline"
            >
              로그인
            </button>
          )}

          <button
            type="button"
            className="bg-transparent text-xl leading-none text-text lg:hidden"
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label="메뉴 열기"
            aria-expanded={isMobileOpen}
          >
            ☰
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isMobileOpen && (
        <nav
          className="max-h-[calc(100vh-80px)] overflow-y-auto border-t border-border bg-white px-4 py-3 lg:hidden"
          aria-label="모바일 메뉴"
        >
          <ul className="flex flex-col gap-1">
            {[...PRIMARY_LINKS, ...TOOL_LINKS].map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'block rounded-lg px-3 py-2.5 text-sm no-underline transition-colors',
                      isActive ? 'bg-primary-light font-semibold text-primary' : 'text-text hover:bg-primary-light',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mt-2 border-t border-border pt-3">
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full bg-transparent px-3 py-2 text-left text-sm text-text-muted"
              >
                로그아웃
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsMobileOpen(false);
                  navigate('/login');
                }}
                className="w-full bg-transparent px-3 py-2 text-left text-sm font-semibold text-primary"
              >
                로그인
              </button>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

interface HeaderIconButtonProps {
  icon: React.ReactNode;
  label: string;
  count: number;
  onClick: () => void;
}

function HeaderIconButton({ icon, label, count, onClick }: HeaderIconButtonProps) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="relative flex items-center justify-center bg-transparent border-0 cursor-pointer text-text-muted hover:text-primary transition-colors"
        onClick={onClick}
        aria-label={label}
      >
        {icon}
        {count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
            {count}
          </span>
        )}
      </button>
      <span
        className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-2.5 py-1.5 text-xs text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100"
        role="tooltip"
      >
        {label}
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-primary" />
      </span>
    </div>
  );
}

function HeaderIconButtons() {
  const navigate = useNavigate();
  const { wishedIds } = useWishlist();
  const { cartIds } = useCart();

  return (
    <>
      <HeaderIconButton
        icon={<Heart className="h-5 w-5" strokeWidth={1.8} />}
        label="찜한 상품"
        count={wishedIds.length}
        onClick={() => navigate('/shop/wishlist')}
      />
      <HeaderIconButton
        icon={<ShoppingBag className="h-5 w-5" strokeWidth={1.8} />}
        label="장바구니"
        count={cartIds.length}
        onClick={() => navigate('/shop/cart')}
      />
    </>
  );
}