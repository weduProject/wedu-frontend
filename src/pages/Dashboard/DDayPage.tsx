import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { useChecklist } from "../Checklist/hooks/useChecklist";
import { useDDay } from "../../contexts/DDayContext";
import { useAuth } from "../../contexts/AuthContext";
import ConfirmDeleteModal from '../../components/ui/ConfirmDeleteModal';
import DDayPageContent from "./components/DDayPageContent";
import ShareLinkCard from "../../components/ui/ShareLinkCard";
import { Button } from "../../components";

export default function DDayPage() {
  const { dday, createDDay, hasDDay, updateDDay, deleteDDay } = useDDay();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { todos, toggleTodo } = useChecklist();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [tempDate, setTempDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  function handleOpenModal() {
    setTempDate(dday?.weddingDate ?? '');
    setSaveError(null);
    setIsModalOpen(true);
  }

  async function handleSaveDate() {
    if (!tempDate) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      if (hasDDay) {
        await updateDDay(tempDate);
      } else {
        await createDDay(tempDate);
      }
      setIsModalOpen(false);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : '저장에 실패했어요.');
    } finally {
      setIsSaving(false);
    }
  }

  const executeDelete = async () => {
    const success = await deleteDDay();
    if (success) {
      setIsDeleteModalOpen(false);
      setIsModalOpen(false);
    } else {
      alert("디데이 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <DDayPageContent
        targetDate={dday?.weddingDate ?? null}
        todos={todos}
        isLoggedIn={!!user}
        onEditClick={handleOpenModal}
        onTodoToggle={toggleTodo}
        onLoginClick={() => navigate('/login')}
      />

      {user && (
        <div className="mt-8">
          <ShareLinkCard pageName="D-day" sharePath="/shared/dday" />
        </div>
      )}

      {/* 날짜 설정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-[90%] max-w-sm rounded-3xl bg-white p-6 shadow-2xl md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-text">날짜 설정</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-2">
              <label className="mb-2 block text-xs font-semibold text-text-muted">결혼 날짜 선택</label>
              <input
                type="date"
                value={tempDate}
                onChange={(e) => setTempDate(e.target.value)}
                className="w-full rounded-xl border border-border bg-gray-50 p-3 text-sm text-text outline-none focus:border-primary focus:bg-white"
              />
            </div>
            {saveError && <p className="mb-4 text-xs text-error">{saveError}</p>}

            <div className="flex justify-end mt-5 mr-5">
              {hasDDay && (
                <button 
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-xs text-text-muted underline underline-offset-2 transition-colors cursor-pointer hover:text-gray-600"
                >
                  내 D-day 삭제하기
                </button>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 rounded-xl py-3.5"
              >
                취소
              </Button>
              <Button
                onClick={handleSaveDate}
                disabled={isSaving || !tempDate}
                className="flex-1 rounded-xl py-3.5"
              >
                {isSaving ? '저장 중...' : '저장하기'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
      />
    </div>
  );
}
