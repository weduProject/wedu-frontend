import { useState } from 'react';
import clsx from 'clsx';
import { 
  Building2, Camera, Plane, Heart, MoreHorizontal, Check, Wallet, Receipt, 
  CheckCircle2, Edit2, Trash2
} from 'lucide-react';

import BaseCard from '../../components/ui/BaseCard';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

import { useBudget } from './hooks/useBudget';
import type { BudgetCategory, BudgetItem } from './hooks/useBudget';
import BudgetModal from './components/BudgetModal';
import BudgetEditModal from './components/BudgetEditModal';
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const CATEGORIES: BudgetCategory[] = ['웨딩홀/예식장', '스튜디오/드레스', '허니문', '예물/예단', '기타'];
const CATEGORY_ICONS = {
  '웨딩홀/예식장': Building2,
  '스튜디오/드레스': Camera,
  '허니문': Plane,
  '예물/예단': Heart,
  '기타': MoreHorizontal,
};

export default function BudgetPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    items:rawItems, targetBudget:rawTargetBudget, updateTargetBudget, addBudgetItem, togglePaidStatus, updateBudgetItem, deleteBudgetItem
  } = useBudget();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const items = user ? rawItems : [];
  const targetBudget = user ? rawTargetBudget : 0;
  
  const [isEditBudgetModalOpen, setIsEditBudgetModalOpen] = useState(false);
  const [editBudgetValue, setEditBudgetValue] = useState(targetBudget.toString());

  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  // 📊 전체 통계 계산
  const totalPaid = items.reduce((acc, item) => acc + item.paidAmount, 0);
  const paidCount = items.filter(item => item.isPaid).length;
  const totalCount = items.length;
  
  const overallProgress = targetBudget === 0 ? 0 : Math.round((totalPaid / targetBudget) * 100);
  const remainingBudget = targetBudget - totalPaid;

  const handleAddClick = () => {
        if (!user) {
          navigate('/login');
          return;
        }
        setIsAddModalOpen(true);
      };

  // 모달에서 예산 저장
  const handleSaveBudget = () => {
    updateTargetBudget(Number(editBudgetValue));
    setIsEditBudgetModalOpen(false);
  };

  const handleEditBudgetValue = () => {
          if (!user) {
            navigate('/login');
            return;
          }
          setEditBudgetValue(targetBudget.toString());
          setIsEditBudgetModalOpen(true);
        };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-serif text-text md:text-3xl">예산 관리</h2>
          <p className="mt-2 text-sm text-text-muted">예산을 설정하고 지출을 추적하세요</p>
        </div>
        <Button onClick={handleAddClick} className="px-5 py-2.5 text-sm">
          + 항목 추가
        </Button>
      </div>

      {/* 1. 상단 요약 카드 3개 */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        
        {/* 1. 전체 예산 카드 */}
        <BaseCard className="flex h-full flex-col justify-between p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light/50">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          
          <div className="mt-5 flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-text-muted">전체 예산</p>
              <p className="text-xl font-bold font-serif leading-none text-text">{targetBudget}만원</p>
            </div>
            
            <button 
              onClick={handleEditBudgetValue}
              className="text-xs leading-none text-text-muted underline decoration-text-muted/40 underline-offset-2 hover:text-text"
            >
              예산 변경하기
            </button>
          </div>
        </BaseCard>

        {/* 2. 집행 금액 카드 */}
        <BaseCard className="flex h-full flex-col justify-between p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light/50">
            <Receipt className="h-5 w-5 text-[#d29b53]" />
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-text-muted">집행 금액</p>
              <p className="text-xl font-bold font-serif leading-none text-text">{totalPaid}만원</p>
            </div>
          </div>
        </BaseCard>

        {/* 3. 결제 완료 카드 */}
        <BaseCard className="flex h-full flex-col justify-between p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light/50">
            <CheckCircle2 className="h-5 w-5 text-[#c382a4]" />
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-medium text-text-muted">결제 완료</p>
              <p className="text-xl font-bold font-serif leading-none text-text">{paidCount}/{totalCount}건</p>
            </div>
          </div>
        </BaseCard>

      </div>

      {/* 2. 전체 집행률 프로그레스 바 */}
      <BaseCard className="mb-6 p-6 shadow-sm">
        <div className="mb-3 flex items-end justify-between">
          <span className="text-sm font-bold text-text">전체 집행률</span>
          <span className="text-lg font-bold text-primary">{overallProgress}%</span>
        </div>
        <div className="mb-2">
          <ProgressBar value={totalPaid} max={targetBudget} showLabel={false} />
        </div>
        <div className="flex justify-between text-xs font-medium text-text-muted">
          <span>예산 {targetBudget}만원</span>
          <span>잔액 {remainingBudget}만원</span>
        </div>
      </BaseCard>

      {/* 3. 카테고리별 리스트 */}
      <div className="flex flex-col gap-6">
        {/* 비회원일 때 보여줄 빈 화면 멘트 */}
        {!user && (
          <EmptyState
            icon={Wallet}
            title="나만의 예산을 계획해보세요"
            description="로그인 후 카테고리별 예산을 관리하고 결제 내역을 기록할 수 있습니다."
          />
        )}

        {CATEGORIES.map(category => {
          const categoryItems = items.filter(item => item.category === category);
          if (categoryItems.length === 0) return null;

          const catTotalBudget = categoryItems.reduce((acc, item) => acc + item.budgetAmount, 0);
          const catTotalPaid = categoryItems.reduce((acc, item) => acc + item.paidAmount, 0);
          const catPaidCount = categoryItems.filter(item => item.isPaid).length;
          const catProgress = catTotalBudget === 0 ? 0 : Math.round((catTotalPaid / catTotalBudget) * 100);
          const Icon = CATEGORY_ICONS[category];

          return (
            <BaseCard key={category} className="p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light/30">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-serif text-text">{category}</h3>
                    <p className="text-xs text-text-muted">{categoryItems.length}개 항목 · {catPaidCount}건 결제 완료</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-text">{catTotalPaid}만원 / {catTotalBudget}만원</p>
                  <p className="text-xs font-medium text-text-muted">{catProgress}%</p>
                </div>
              </div>

              <div className="mb-4">
                <ProgressBar value={catTotalPaid} max={catTotalBudget} showLabel={false} />
              </div>

              <div className="flex flex-col gap-1">
                {categoryItems.map(item => (
                  <div 
                    key={item.id} 
                    className="group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePaidStatus(item.id)}
                        className={clsx(
                        'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors cursor-pointer',
                        item.isPaid ? 'border-primary bg-primary' : 'border-gray-300 bg-white group-hover:border-primary'
                      )}>
                        {item.isPaid && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                      </button>
                      <span className={clsx('text-sm transition-all', item.isPaid ? 'font-medium text-text' : 'text-text-muted')}>
                        {item.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-text">
                        {item.paidAmount === 0 ? '0원' : `${item.paidAmount}만원`} / {item.budgetAmount}만원
                      </span>
                      
                      <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f4f4f4] text-[#8e8e8e] transition-colors hover:bg-gray-200"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setItemToDelete(item.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#F04444] transition-colors hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </BaseCard>
          );
        })}
      </div>

      {/* 전체 예산 변경 모달 */}
      {isEditBudgetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-text">전체 예산 변경</h3>
            <div className="mb-6 flex items-center gap-3">
              <input 
                type="number"
                value={editBudgetValue}
                onChange={(e) => setEditBudgetValue(e.target.value)}
                className="flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
              <span className="font-bold text-text">만원</span>
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setIsEditBudgetModalOpen(false)} variant='secondary' className="bg-gray-200 text-text hover:bg-gray-300">취소</Button>
              <Button onClick={handleSaveBudget}>저장</Button>
            </div>
          </div>
        </div>
      )}

      {/* 항목 추가 모달 */}
      {isAddModalOpen && (
        <BudgetModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSubmit={(newItem) => {
            addBudgetItem(newItem);
            setIsAddModalOpen(false); // 저장 후 모달 닫기
          }} 
        />
      )}

      {/* 상세 금액 수정 모달 */}
      {editingItem && (
        <BudgetEditModal 
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(id, updates) => {
            updateBudgetItem(id, {
              ...updates,
              isPaid: (updates.paidAmount ?? 0) > 0 
            });
            setEditingItem(null);
          }}
          onDelete={(id) => {
            deleteBudgetItem(id);
            setEditingItem(null);
          }}
        />
      )}

      {/* 삭제 확인 모달 연동 */}
      <ConfirmDeleteModal 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            deleteBudgetItem(itemToDelete);
            setItemToDelete(null);
          }
        }}
      />

    </div>
  );
}