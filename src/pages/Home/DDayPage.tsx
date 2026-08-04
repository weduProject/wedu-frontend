import DDayCard from "./components/DDayCard";
import BaseCard from "../../components/ui/BaseCard";
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ClipboardList, CheckCircle2, Circle, ArrowRight, X } from 'lucide-react';


// 더미 데이터 배열
const ANNIVERSARIES = [
  { id: 1, title: '처음 만난 날', desc: '운명적인 첫 만남, 모든 것이 시작된 순간.', icon: '❤️' },
  { id: 2, title: '프로포즈', desc: '평생 잊지 못할 가장 특별한 순간.', icon: '🎁' },
  { id: 3, title: '결혼식', desc: '사랑의 약속을 세상 앞에 선언하는 날.', icon: '👑' },
  { id: 4, title: '신혼여행', desc: '둘만의 달콤한 여행, 새로운 시작.', icon: '🧳' },
];

const CHECKLIST = [
  { id: 1, dDay: 'D-180', task: '예식장 계약 및 예약금 납부' },
  { id: 2, dDay: 'D-150', task: '스튜디오/드레스/메이크업 예약' },
  { id: 3, dDay: 'D-120', task: '신혼집 마련 계획 세우기' },
  { id: 4, dDay: 'D-90', task: '청첩장 디자인 및 인쇄 의뢰' },
  { id: 5, dDay: 'D-60', task: '허니문 일정 확정 및 예약' },
  { id: 6, dDay: 'D-30', task: '본식 리허설 및 최종 점검' },
];

export default function DDayPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetDate, setTargetDate] = useState("2026-11-18");

  return (
    <div className="mx-auto max-w-[1024px] pb-20">
      {/* 1. 상단 D-day 카드 (버튼 활성화) */}
      <DDayCard 
        targetDate={targetDate}
        showEditButton={true} 
        onEditClick={() => setIsModalOpen(true)}
      />

      {/* 2단 그리드 레이아웃 (소중한 기억들 & 웨딩 체크리스트) */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        {/* 2-1. 소중한 기억들 섹션 */}
        <BaseCard className="flex h-full flex-col p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <Heart className="h-6 w-6 text-primary" strokeWidth={2.5} />
            <div>
              <h2 className="text-lg font-bold text-text">소중한 기억들</h2>
              <p className="text-xs text-text-muted mt-0.5">함께 걸어온 특별한 순간들</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ANNIVERSARIES.map((item) => (
              <div key={item.id} className="flex flex-col rounded-2xl border border-gray-100 bg-[#FAFAFA] p-5 transition-colors hover:border-primary-light">
                <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-pink-50 text-base text-primary">
                  {item.icon}
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-text">{item.title}</h3>
                <p className="text-[11px] leading-relaxed text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </BaseCard>

        {/* 2-2. 웨딩 체크리스트 섹션 */}
        <BaseCard className="flex h-full flex-col p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-orange-400" strokeWidth={2.5} />
            <div>
              <h2 className="text-lg font-bold text-text">웨딩 체크리스트</h2>
              <p className="text-xs text-text-muted mt-0.5">준비해야 할 핵심 일정</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-5">
            {CHECKLIST.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <span className="flex w-14 shrink-0 items-center justify-center rounded-full bg-red-50 py-1 text-[11px] font-bold text-primary">
                    {item.dDay}
                  </span>
                  <p className={`text-sm ${item.isCompleted ? 'text-gray-400 line-through' : 'text-text font-medium'}`}>
                    {item.task}
                  </p>
                </div>
                {/* 체크박스 상태 렌더링 */}
                {item.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" fill="currentColor" color="white" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300" />
                )}
              </div>
            ))}
          </div>

          {/* 전체 체크리스트 보기 하단 링크 */}
          <div className="mt-8 border-t border-gray-100 pt-5">
            <Link to= "/checklist" className="flex items-center gap-1 text-sm font-semibold text-primary transition-opacity hover:opacity-80">
              전체 체크리스트 보기 <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </BaseCard>

      </div>

      {/* 3. 날짜 설정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
          <div className="w-[90%] max-w-sm rounded-[24px] bg-white p-6 shadow-2xl md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-text">날짜 설정</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-8">
              <label className="mb-2 block text-xs font-semibold text-text-muted">결혼 날짜 선택</label>
              <input 
                type="date"
                defaultValue={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-gray-50 p-3 text-sm text-text outline-none transition-colors focus:border-primary focus:bg-white"
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-xl bg-gray-100 py-3.5 text-sm font-semibold text-text transition-colors hover:bg-gray-200"
              >
                취소
              </button>
              <button 
                onClick={() => setIsModalOpen(false)} // 실제로는 저장 로직(API 호출 등)이 들어갑니다.
                className="flex-1 rounded-xl bg-gradient-to-r from-[#F4A4A4] to-[#E58080] py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 shadow-sm shadow-primary/30"
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}