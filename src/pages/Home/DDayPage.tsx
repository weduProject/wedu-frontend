import DDayCard from "./components/DDayCard";
import BaseCard from "../../components/ui/BaseCard";


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
  const handleEditDate = () => {
    // TODO: 날짜 변경 모달 띄우기 로직 (추후 구현)
    alert('날짜 변경 모달을 띄웁니다');
  };

  return (
    <div className="mx-auto max-w-[1024px]">
      {/* 1. 상단 D-day 카드 (버튼 활성화) */}
      <DDayCard 
        targetDate="2026-11-18" 
        weddingDateText="2026년 11월 18일" 
        showEditButton={true} 
        onEditClick={handleEditDate}
      />

      {/* 2. 특별한 기념일 섹션 */}
      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-text">특별한 기념일</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ANNIVERSARIES.map((item) => (
            <BaseCard key={item.id} className="p-5 shadow-sm transition-transform">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light/50 text-lg text-primary">
                {item.icon}
              </div>
              <h3 className="mb-1 text-sm font-bold text-text">{item.title}</h3>
              <p className="text-xs text-text-muted leading-relaxed">{item.desc}</p>
            </BaseCard>
          ))}
        </div>
      </section>

      {/* 3. D-DAY 체크리스트 섹션 */}
      <section className="mt-8">
        <BaseCard className="p-6 md:p-8 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-400">
              💡
            </div>
            <h2 className="text-lg font-bold text-text">D-DAY 체크리스트</h2>
          </div>

          <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-2">
            {CHECKLIST.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <span className="flex w-14 shrink-0 items-center justify-center rounded-full bg-primary-light/50 px-2 py-1 text-xs font-bold text-primary">
                  {item.dDay}
                </span>
                <p className="text-sm font-medium text-text">{item.task}</p>
              </div>
            ))}
          </div>
        </BaseCard>
      </section>
    </div>
  );
}