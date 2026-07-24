import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../pages/Shop/WishlistContext';

interface HeaderProps {
  avatarUrl?: string;
  onNotificationClick?: () => void;
}

export default function Header({ avatarUrl, onNotificationClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { wishedIds } = useWishlist();
  const navigate = useNavigate();
  const wishCount = wishedIds.length;

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="flex justify-end items-center gap-4 px-4 py-3 border-b border-border bg-white sticky top-0 z-10 md:px-8 md:py-4">
      {user ? (
        <>
          <div className="group relative">
            <button
              type="button"
              className="group relative flex items-center justify-center bg-transparent border-0 cursor-pointer text-text-muted hover:text-primary transition-colors"
              onClick={() => navigate('/shop/wishlist')}
              aria-label="찜한 상품"
            >
              <Heart
                className="h-5 w-5 transition-colors group-hover:fill-primary"
                strokeWidth={1.8}
              />
              {wishCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                  {wishCount}
                </span>
              )}
            </button>

            <span
              className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary px-2.5 py-1.5 text-xs text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100"
              role="tooltip"
            >
              찜한 상품
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-primary" />
            </span>
          </div>

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
            로그아웃
          </button>
        </>
      ) : (
        <button
          type="button"
          className="bg-transparent border-0 cursor-pointer text-sm text-primary font-semibold hover:opacity-80 transition-opacity"
          onClick={() => navigate('/login')}
        >
          로그인
        </button>
      )}
    </header>
  );
}