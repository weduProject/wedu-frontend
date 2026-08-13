import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, ShoppingBag, ChevronDown, Sparkles, CreditCard, ListChecks, Calendar, User, BookOpen, Newspaper, Calculator, Mail, Users } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../pages/Shop/utils/useWishlist';
import { useCart } from '../../pages/Shop/CartContext';

const PRIMARY_LINKS = [
  { label: '홈', path: '/home' },
  { label: '심리테스트', path: '/onboarding' },
  { label: '프로포즈 플래닝', path: '/shop' },
] as const;

const WEDDING_LINKS = [
  { label: '웨딩 룩북', path: '/wedding-shop', Icon: BookOpen },
  { label: '웨딩 매거진', path: '/magazine', Icon: Newspaper },
  { label: '웨딩 견적', path: '/wedding-estimate', Icon: Calculator },
  { label: '모바일 청첩장', path: '/invitation', Icon: Mail },
  { label: '파트너 연결', path: '/connect', Icon: Users },
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
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isWeddingOpen, setIsWeddingOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(true);
  const [mobileWeddingOpen, setMobileWeddingOpen] = useState(true);
  const toolsRef = useRef<HTMLDivElement>(null);
  const weddingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setIsToolsOpen(false);
      }
      if (weddingRef.current && !weddingRef.current.contains(e.target as Node)) {
        setIsWeddingOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  function handleLogout() {
    logout();
    setIsMobileOpen(false);
    navigate('/');
  }

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 shadow-[0px_1px_0px_rgba(232,121,108,0.18)] backdrop-blur transition-all duration-500',
        scrolled ? 'bg-white/80 backdrop-blur-xl' : 'bg-white/40',
      )}
    >
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

          {/* 웨딩 플래닝 드롭다운 — 버튼과 메뉴 사이 gap을 pt-2(패딩)로 감싸서 마우스 이탈 방지 */}
          <div
            ref={weddingRef}
            className="relative"
            onMouseEnter={() => setIsWeddingOpen(true)}
            onMouseLeave={() => setIsWeddingOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsWeddingOpen((prev) => !prev)}
              aria-expanded={isWeddingOpen}
              className="flex items-center gap-1 text-sm font-medium text-[#3E3939] transition-colors hover:text-primary"
            >
              웨딩 플래닝
              <ChevronDown
                className={clsx('h-4 w-4 transition-transform duration-200', isWeddingOpen && 'rotate-180')}
                strokeWidth={1.8}
              />
            </button>

            {isWeddingOpen && (
              <div className="absolute left-0 top-full w-44 pt-2">
                <div className="rounded-xl border border-border bg-white p-1.5 shadow-lg">
                  {WEDDING_LINKS.map(({ label, path, Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() => setIsWeddingOpen(false)}
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
              </div>
            )}
          </div>

          <NavLink to="/community" className={navLinkClass}>
            커뮤니티
          </NavLink>

          <span className="h-5 w-px bg-[rgba(171,162,161,0.4)]" aria-hidden />

          <div
            ref={toolsRef}
            className="relative"
            onMouseEnter={() => setIsToolsOpen(true)}
            onMouseLeave={() => setIsToolsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsToolsOpen((prev) => !prev)}
              aria-expanded={isToolsOpen}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-[#3E3939] transition-colors hover:text-primary"
            >
              관리도구
              <ChevronDown
                className={clsx('h-4 w-4 transition-transform duration-200', isToolsOpen && 'rotate-180')}
                strokeWidth={1.8}
              />
            </button>

            {isToolsOpen && (
              <div className="absolute left-0 top-full w-52 pt-2">
                <div className="rounded-xl border border-border bg-white p-1.5 shadow-lg">
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
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <>
              <HeaderIconButtons />
              <Link
                to="/mypage"
                className="hidden text-sm font-medium text-[#3E3939] transition-colors hover:text-primary sm:inline"
              >
                {user.name}님
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden rounded-full bg-[linear-gradient(111.47deg,#F79689_0%,#E8796C_33.33%,#FEABA0_66.67%,#E8796C_100%)] px-5 py-2 text-sm font-medium text-white shadow-[0px_4px_14px_rgba(161,86,77,0.18),0px_0px_24px_rgba(232,121,108,0.28),inset_0px_1px_0px_rgba(255,255,255,0.2)] transition-opacity hover:opacity-90 sm:inline"
              >
                로그아웃
              </button>
            </>
          ) : (
            location.pathname !== '/login' && (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="hidden bg-transparent text-sm font-semibold text-primary transition-opacity hover:opacity-80 sm:inline"
              >
                로그인
              </button>
            )
          )}

          <button
            type="button"
            className="bg-transparent text-xl leading-none text-text transition-transform duration-300 lg:hidden"
            style={{ transform: isMobileOpen ? 'rotate(90deg)' : 'none' }}
            onClick={() => setIsMobileOpen((prev) => !prev)}
            aria-label="메뉴 열기"
            aria-expanded={isMobileOpen}
          >
            ☰
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed inset-x-0 top-16 z-40 h-[calc(100dvh-4rem)] overflow-hidden border-t border-border bg-white shadow-xl md:top-20 lg:hidden">
            <div className="flex h-full flex-col">
              <div className="flex-1 overflow-y-auto px-4 pb-2 pt-4">
                {PRIMARY_LINKS.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={({ isActive }) =>
                      clsx(
                        'block py-3 text-base font-medium no-underline transition-colors',
                        isActive ? 'text-primary' : 'text-text',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}

                <button
                  type="button"
                  onClick={() => setMobileWeddingOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between bg-transparent py-3 text-left text-base font-medium text-text"
                >
                  <span>웨딩 플래닝</span>
                  <ChevronDown
                    className={clsx('h-5 w-5 transition-transform duration-300', mobileWeddingOpen && 'rotate-180')}
                    strokeWidth={1.8}
                  />
                </button>
                <div
                  className={clsx(
                    'grid transition-[grid-template-rows] duration-300 ease-out',
                    mobileWeddingOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="flex flex-col">
                      {WEDDING_LINKS.map(({ label, path, Icon }) => (
                      <NavLink
                        key={path}
                        to={path}
                        onClick={() => setIsMobileOpen(false)}
                        className={({ isActive }) =>
                          clsx(
                            'flex items-center gap-2.5 py-2.5 pl-4 text-sm no-underline transition-colors',
                            isActive ? 'font-semibold text-primary' : 'text-text',
                          )
                        }
                      >
                        <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                        {label}
                      </NavLink>
                    ))}
                    </div>
                  </div>
                </div>

                <NavLink
                  to="/community"
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'block py-3 text-base font-medium no-underline transition-colors',
                      isActive ? 'text-primary' : 'text-text',
                    )
                  }
                >
                  커뮤니티
                </NavLink>

                <button
                  type="button"
                  onClick={() => setMobileToolsOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between bg-transparent py-3 text-left text-base font-medium text-text"
                >
                  <span>관리도구</span>
                  <ChevronDown
                    className={clsx('h-5 w-5 transition-transform duration-300', mobileToolsOpen && 'rotate-180')}
                    strokeWidth={1.8}
                  />
                </button>
                <div
                  className={clsx(
                    'grid transition-[grid-template-rows] duration-300 ease-out',
                    mobileToolsOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  )}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="flex flex-col">
                      {TOOL_LINKS.map(({ label, path, Icon }) => (
                        <NavLink
                          key={path}
                          to={path}
                          onClick={() => setIsMobileOpen(false)}
                          className={({ isActive }) =>
                            clsx(
                              'flex items-center gap-2.5 py-2.5 pl-4 text-sm no-underline transition-colors',
                              isActive ? 'font-semibold text-primary' : 'text-text',
                            )
                          }
                        >
                          <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                          {label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-t border-border px-4 pb-6 pt-4">
                {user ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-full bg-[linear-gradient(111.47deg,#F79689_0%,#E8796C_33.33%,#FEABA0_66.67%,#E8796C_100%)] py-3.5 text-center text-base font-medium text-white"
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
                    className="w-full rounded-full border border-primary py-3.5 text-center text-base font-medium text-primary"
                  >
                    로그인
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
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
        className="relative flex items-center justify-center border-0 bg-transparent text-text-muted transition-colors hover:text-primary"
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
  const { cart } = useCart();

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
        count={cart?.items.length ?? 0}
        onClick={() => navigate('/shop/cart')}
      />
    </>
  );
}