interface HeaderProps {
  userName?: string;
  avatarUrl?: string;
  onNotificationClick?: () => void;
}

export default function Header({
  userName = 'OOO님',
  avatarUrl,
  onNotificationClick,
}: HeaderProps) {
  return (
    <header className="flex justify-end items-center gap-4 px-4 py-3 border-b border-border bg-white sticky top-0 z-10 md:px-8 md:py-4">
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
            {userName ? userName.charAt(0) : '?'}
          </span>
        )}
        <span className="text-sm">{userName}</span>
      </div>
    </header>
  );
}
