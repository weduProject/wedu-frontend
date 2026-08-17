import { useState } from 'react';
import { Wallet } from 'lucide-react';

import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';

import { useBudget } from './hooks/useBudget';
import type { BudgetItem } from './hooks/useBudget';
import BudgetModal from './components/BudgetModal';
import BudgetEditModal from './components/BudgetEditModal';
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import BudgetPageContent from './components/BudgetPageContent';
import ShareLinkCard from '../../components/ui/ShareLinkCard';

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

  const handleAddClick = () => {
        if (!user) {
          navigate('/login');
          return;
        }
        setIsAddModalOpen(true);
      };

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

      <BudgetPageContent
        items={items}
        targetBudget={targetBudget}
        fallbackUI={
          !user ? (
            <EmptyState
              icon={Wallet}
              title="나만의 예산을 계획해보세요"
              description="로그인 후 카테고리별 예산을 관리하고 결제 내역을 기록할 수 있습니다."
            />
          ) : undefined
        }
        onEditBudgetClick={handleEditBudgetValue}
        onTogglePaidStatus={togglePaidStatus}
        onEditItemClick={setEditingItem}
        onDeleteItemClick={setItemToDelete}
      />

      {user && (
        <div className="mt-8">
          <ShareLinkCard 
            pageName="예산 관리" 
            sharePath="/shared/budget" 
          />
        </div>
      )}

      

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