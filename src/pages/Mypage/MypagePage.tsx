import { useNavigate, Link } from 'react-router-dom';
import { PenLine, MessageCircle, Heart, Bookmark, ChevronRight, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const hasOnboardingToken = Boolean(localStorage.getItem('wedu_onboarding'));

const MENU_ITEMS = [
  {
    icon: <Heart className="h-4 w-4 text-primary" strokeWidth={1.8} />,
    bg: 'bg-primary-light',
    title: '심리테스트 결과',
    desc: '나의 프로포즈 스타일 확인',
    to: hasOnboardingToken ? '/onboarding/result' : '/onboarding',
  },
  {
    icon: <Bookmark className="h-4 w-4 text-amber-500" strokeWidth={1.8} />,
    bg: 'bg-amber-50',
    title: '저장한 상품',
    desc: '원한 프로포즈 상품 보기',
    to: '/shop/wishlist',
  },
  {
    icon: <PenLine className="h-4 w-4 text-blue-500" strokeWidth={1.8} />,
    bg: 'bg-blue-50',
    title: '내 게시글',
    desc: '커뮤니티 작성 글',
    to: '/community',
  },
  {
    icon: <MessageCircle className="h-4 w-4 text-text-muted" strokeWidth={1.8} />,
    bg: 'bg-gray-100',
    title: '프로필 수정',
    desc: '이름·결혼식 날짜 변경 / 파트너·공유 링크 연결',
    to: '/mypage/edit',
  },
];

const STATS = [
  { icon: <PenLine className="h-4 w-4" strokeWidth={1.8} />, label: '게시글', value: 0 },
  { icon: <MessageCircle className="h-4 w-4" strokeWidth={1.8} />, label: '댓글', value: 0 },
  { icon: <Heart className="h-4 w-4" strokeWidth={1.8} />, label: '테스트', value: 0 },
  { icon: <Bookmark className="h-4 w-4" strokeWidth={1.8} />, label: '저장', value: 0 },
];

export default function MypagePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="bg-surface -mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8 min-h-[calc(100dvh-80px)] md:min-h-[calc(100dvh-96px)] flex flex-col px-5 md:px-8 py-10 md:py-14">
    <div className="mx-auto w-full max-w-2xl flex flex-col gap-3 my-auto">

      {/* 프로필 카드 */}
      <div className="rounded-2xl border border-border bg-surface px-6 py-5">
        <div className="flex items-center gap-4">
          {/* 아바타 */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gradient-primary-bg text-xl font-bold text-white shadow-sm">
            {user ? user.name.charAt(0) : '?'}
          </div>

          {/* 이름 + 서브텍스트 */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-text text-base truncate">
              {user ? `${user.name}님` : '비회원'}
            </p>
            <p className="text-xs text-text-muted mt-0.5">
              {user ? 'WEDU와 함께 특별한 날을 준비 중이에요' : '로그인 후 이용해보세요'}
            </p>
          </div>

          {/* 로그아웃 */}
          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs text-text-muted hover:bg-gray-50 transition-colors cursor-pointer"
            >
              로그아웃
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 transition-opacity cursor-pointer"
            >
              로그인
            </button>
          )}
        </div>
      </div>

      {/* 통계 */}
      <div className="rounded-2xl border border-border bg-surface px-2 py-4">
        <div className="grid grid-cols-4 divide-x divide-border">
          {STATS.map(({ icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 py-1">
              <span className="text-text-muted">{icon}</span>
              <span className="text-lg font-bold text-text leading-none">{value}</span>
              <span className="text-[11px] text-text-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div className="flex flex-col gap-3">
        {MENU_ITEMS.map(({ icon, bg, title, desc, to }) => (
          <Link
            key={title}
            to={to}
            className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-6 py-4 hover:bg-gray-50 transition-colors no-underline"
          >
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bg}`}>
              {icon}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-text">{title}</p>
              <p className="text-xs text-text-muted mt-0.5">{desc}</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-text-muted" strokeWidth={1.8} />
          </Link>
        ))}
      </div>

      {/* 대시보드로 이동 */}
      <div className="flex justify-center pt-6 pb-4">
        <button
          type="button"
          onClick={() => navigate('/mypage/dashboard')}
          className="btn-primary flex items-center gap-2"
        >
          <LayoutDashboard className="h-4 w-4" strokeWidth={1.8} />
          대시보드로 이동
        </button>
      </div>

    </div>
    </div>
  );
}
