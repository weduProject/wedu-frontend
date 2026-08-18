// src/pages/DDay/components/DDayPageContent.tsx
import { Link } from 'react-router-dom';
import { Heart, ClipboardList, CheckCircle2, Circle, ArrowRight, Gift, Crown, Luggage, Check } from 'lucide-react';
import BaseCard from '../../../components/ui/BaseCard';
import DDayCard from './DDayCard';
import type { TodoItem } from '../../Checklist/hooks/useChecklist';

const ANNIVERSARIES = [
  { id: 1, title: '처음 만난 날', desc: '운명적인 첫 만남, 모든 것이 시작된 순간.', icon: <Heart className="h-4 w-4" /> },
  { id: 2, title: '프로포즈', desc: '평생 잊지 못할 가장 특별한 순간.', icon: <Gift className="h-4 w-4" /> },
  { id: 3, title: '결혼식', desc: '사랑의 약속을 세상 앞에 선언하는 날.', icon: <Crown className="h-4 w-4" /> },
  { id: 4, title: '신혼여행', desc: '둘만의 달콤한 여행, 새로운 시작.', icon: <Luggage className="h-4 w-4" /> },
];

interface DDayPageContentProps {
  targetDate: string | null;
  todos: TodoItem[];
  isLoggedIn?: boolean;
  readOnly?: boolean;
  onEditClick?: () => void;
  onTodoToggle?: (id: string) => void;
  onLoginClick?: () => void;
}

export default function DDayPageContent({
  targetDate, todos, isLoggedIn = false, readOnly = false, onEditClick, onTodoToggle, onLoginClick
}: DDayPageContentProps) {
  
  const previewTodos = todos.slice(0, 5);

  return (
    <div>
      <DDayCard
        targetDate={targetDate}
        showEditButton={true}
        readOnly={readOnly}
        onEditClick={onEditClick}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 소중한 기억들 */}
        <BaseCard className="flex h-full flex-col p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-primary">
              <Heart className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">소중한 기억들</h2>
              <p className="mt-0.5 text-xs text-text-muted">함께 걸어온 특별한 순간들</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ANNIVERSARIES.map((item) => (
              <div key={item.id} className="flex flex-col rounded-2xl border border-gray-100 bg-[#FAFAFA] p-5 transition-colors hover:border-primary-light">
                <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-pink-50 text-primary">
                  {item.icon}
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-text">{item.title}</h3>
                <p className="text-[11px] leading-relaxed text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </BaseCard>          

        {/* 웨딩 체크리스트 */}
        <BaseCard className="flex h-full flex-col p-6 md:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <ClipboardList className="h-5 w-5" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">웨딩 체크리스트</h2>
              <p className="mt-0.5 text-xs text-text-muted">준비해야 할 핵심 일정</p>
            </div>
          </div>

          {!isLoggedIn && !readOnly ? (
            <div className="flex h-full flex-col p-6">
              <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light/30">
                  <Check className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-text-muted">할 일을 등록하고<br />진행률을 확인하세요</p>
              </div>
              <div className="mt-4 border-t border-border pt-4 text-center">
                <button onClick={onLoginClick} className="text-sm font-semibold text-primary hover:underline">
                  로그인하고 시작하기
                </button>
              </div>
            </div>
          ) : todos.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-6 text-center">
              <div className="mt-6 mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-light/30">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
              <p className="mb-1.5 text-sm text-text-muted">
                {readOnly ? '등록된 체크리스트가 없습니다.' : '아직 체크리스트를 만들지 않으셨어요'}
              </p>
              {!readOnly && (
                <Link to="/checklist" className="text-sm font-semibold text-primary no-underline hover:underline">
                  체크리스트 만들러 가기
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-1 flex-col gap-5">
                {previewTodos.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => !readOnly && onTodoToggle?.(item.id)} // ✨ 읽기 전용일 때는 토글 제한
                    className={`flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0 ${readOnly ? 'cursor-default' : 'cursor-pointer transition-opacity hover:opacity-70'}`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="flex w-12 shrink-0 items-center justify-center rounded-full bg-red-50 py-1 text-[11px] font-bold text-primary">
                        {item.category}
                      </span>
                      <p className={`text-sm ${item.isCompleted ? 'text-gray-400 line-through' : 'font-medium text-text'}`}>
                        {item.text}
                      </p>
                    </div>
                    {item.isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" fill="currentColor" color="white" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                ))}
              </div>
              {!readOnly && (
                <div className="mt-8 border-t border-gray-100 pt-5">
                  <Link to="/checklist" className="flex items-center gap-1 text-sm font-semibold text-primary transition-opacity hover:opacity-80">
                    전체 체크리스트 보기 <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </>
          )}
        </BaseCard>
      </div>
    </div>
  );
}