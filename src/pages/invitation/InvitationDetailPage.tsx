import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

export default function InvitationDetailPage() {
  const [bgmPlaying, setBgmPlaying] = useState(false);

  const toggleBgm = useCallback(() => {
    setBgmPlaying((prev) => !prev);
  }, []);

  return (
    <div className="min-h-screen bg-background-50 relative">
      <button
        onClick={toggleBgm}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-background-200 shadow-lg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
      >
        <i className={`${bgmPlaying ? 'ri-music-fill text-primary-500' : 'ri-music-line text-foreground-500'} text-xl`}></i>
      </button>

      <div className="max-w-md mx-auto">
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50/40 via-background-50 to-background-50"></div>
          <div className="relative z-10">
            <p className="text-xs text-foreground-400 tracking-[0.3em] uppercase mb-4 font-medium">WEDDING INVITATION</p>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground-950 mb-2 tracking-tight">
              신랑 &amp; 신부
            </h1>
            <p className="text-sm md:text-base font-heading text-foreground-700 mt-6">2026년 10월 일요일</p>
          </div>
          <div className="mt-12 relative z-10">
            <Link
              to="/invitation"
              className="px-6 py-3 rounded-full text-sm font-medium btn-rose-gold text-white"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
