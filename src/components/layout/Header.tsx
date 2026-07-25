import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  avatarUrl?: string;
  onNotificationClick?: () => void;
  onMenuClick?: () => void;
}

export default function Header({ avatarUrl, onNotificationClick, onMenuClick }: HeaderProps) {
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
      </div>
    </header>
  );
}
