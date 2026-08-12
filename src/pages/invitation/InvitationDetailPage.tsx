import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Music } from 'lucide-react'; // Remix Icon -> Lucide React 교체

export default function InvitationDetailPage() {
  const [bgmPlaying, setBgmPlaying] = useState(false);

  const toggleBgm = useCallback(() => {
    setBgmPlaying((prev) => !prev);
  }, []);

  return (
    // bg-background-50 -> bg-gray-50 교체
    <div className="min-h-screen bg-gray-50 relative">
      <button
        onClick={toggleBgm}
        // border-background-200 -> border-gray-200 교체
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-lg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
      >
        <Music 
          className={`h-5 w-5 ${bgmPlaying ? 'text-primary' : 'text-gray-500'}`} 
          strokeWidth={2} 
        />
      </button>

      <div className="max-w-md mx-auto">
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-gray-50 to-gray-50"></div>
          <div className="relative z-10">
            {/* text-foreground-400 -> text-gray-400 교체 */}
            <p className="text-xs text-gray-400 tracking-[0.3em] uppercase mb-4 font-medium">WEDDING INVITATION</p>
            {/* text-foreground-950 -> text-gray-900 교체 */}
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900 mb-2 tracking-tight">
              신랑 &amp; 신부
            </h1>
            {/* text-foreground-700 -> text-gray-700 교체 */}
            <p className="text-sm md:text-base font-heading text-gray-700 mt-6">2026년 10월 일요일</p>
          </div>
          <div className="mt-12 relative z-10">
            <Link
              to="/invitation"
              // btn-rose-gold 커스텀 클래스 대신 Tailwind 클래스 및 공통 색상 적용
              className="px-6 py-3 rounded-full text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-colors"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
