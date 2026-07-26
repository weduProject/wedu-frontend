import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const WEDDING_DATE = '2026-11-18';
const WEDDING_DATE_TEXT = '2026년 11월 18일';

function getDday(targetDate: string) {
  const diff = +new Date(targetDate) - +new Date();
  return diff > 0 ? Math.floor(diff / (1000 * 60 * 60 * 24)) : 0;
}

const PROVIDER_LABEL: Record<string, string> = {
  kakao: '카카오 로그인',
  google: '구글 로그인',
};

export default function MypagePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  const dday = getDday(WEDDING_DATE);

  return (
    <main className="max-w-lg mx-auto flex flex-col gap-6">
      <h1 className="text-2xl font-bold">마이페이지</h1>

      {/* 프로필 카드 */}
      <section className="bg-white rounded-2xl border border-border p-6 flex items-center gap-4">
        <span className="w-14 h-14 rounded-full bg-primary-light text-primary text-xl font-bold flex items-center justify-center shrink-0">
          {user ? user.name.charAt(0) : '?'}
        </span>
        <div className="flex flex-col gap-0.5">
          <p className="font-semibold text-text">{user ? `${user.name}님` : '비회원'}</p>
          {user?.email && <p className="text-sm text-text-muted">{user.email}</p>}
          {user?.provider && (
            <p className="text-xs text-text-muted">{PROVIDER_LABEL[user.provider] ?? user.provider}</p>
          )}
        </div>
      </section>

      {/* 웨딩 정보 — 로그인 시에만 표시 */}
      {user && (
        <section className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-4">
          <h2 className="text-sm font-semibold text-text-muted">웨딩 정보</h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text">웨딩일</span>
              <span className="text-sm font-medium text-text">{WEDDING_DATE_TEXT}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text">D-day</span>
              <span className="text-sm font-semibold text-primary">D-{dday}</span>
            </div>
          </div>
        </section>
      )}

      {/* 계정 관리 */}
      {user ? (
        <section className="bg-white rounded-2xl border border-border overflow-hidden">
          <h2 className="text-sm font-semibold text-text-muted px-6 pt-5 pb-3">계정 관리</h2>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left px-6 py-4 text-sm text-text hover:bg-gray-50 transition-colors border-t border-border cursor-pointer bg-transparent"
          >
            로그아웃
          </button>
          <button
            type="button"
            className="w-full text-left px-6 py-4 text-sm text-error hover:bg-gray-50 transition-colors border-t border-border cursor-pointer bg-transparent"
          >
            회원탈퇴
          </button>
        </section>
      ) : (
        <section className="bg-white rounded-2xl border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full text-left px-6 py-4 text-sm text-primary font-semibold hover:bg-gray-50 transition-colors cursor-pointer bg-transparent"
          >
            로그인하러 가기 →
          </button>
        </section>
      )}
    </main>
  );
}
