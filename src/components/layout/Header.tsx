import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  avatarUrl?: string;
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
}

export default function Header({ avatarUrl, onNotificationClick: _onNotificationClick, onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="flex justify-between items-center gap-4 px-4 py-3 border-b border-border bg-white sticky top-0 z-10 md:px-8 md:py-4">
      {/* 햄버거 버튼 — 모바일에서만 표시 */}
      <button
        type="button"
        className="lg:hidden bg-transparent border-0 cursor-pointer text-text text-xl leading-none"
        onClick={onMenuClick}
        aria-label="메뉴 열기"
      >
        ☰
      </button>

      <div className="flex items-center gap-4 ml-auto">
        {user ? (
          <>
            <HeaderIconButtons />
            <div className="flex items-center gap-2">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-primary-light text-primary text-sm font-semibold"
                  aria-hidden
                >
                  {user.name.charAt(0)}
                </span>
              )}
              <span className="text-sm">{user.name}님</span>
            </div>
            <button
              type="button"
              className="bg-transparent border-0 cursor-pointer text-text-muted text-sm hover:text-primary transition-colors"
              onClick={() => { logout(); navigate('/'); }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <button
            type="button"
            className="bg-transparent border-0 cursor-pointer text-sm text-primary font-semibold hover:opacity-80 transition-opacity"
            onClick={() => navigate('/login')}
    <header className="flex justify-end items-center gap-4 px-4 py-3 border-b border-border bg-white sticky top-0 z-10 md:px-8 md:py-4">
      {user ? (
        <>
          <button
            type="button"
            className="bg-transparent border-0 cursor-pointer text-text-muted text-sm hover:text-primary transition-colors"
            onClick={onNotificationClick}
            aria-label="알림"
          >
            알림
          </button>
          <div className="flex items-center gap-2">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center bg-primary-light text-primary text-sm font-semibold"
                aria-hidden
              >
                {user.name.charAt(0)}
              </span>
            )}
            <span className="text-sm">{user.name}님</span>
          </div>
          <button
            type="button"
            className="bg-transparent border-0 cursor-pointer text-text-muted text-sm hover:text-primary transition-colors"
            onClick={handleLogout}
          >
            로그인
          </button>
        )}
      </div>
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
}
