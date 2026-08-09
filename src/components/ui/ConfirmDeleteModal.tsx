import { AlertCircle } from 'lucide-react';
import BaseCard from './BaseCard';
import Button from './Button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export default function ConfirmDeleteModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = '항목을 삭제 할까요?', 
  message = '삭제한 항목은 복구할 수 없어요' 
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <BaseCard className="w-full max-w-100 bg-white/90 p-8 text-center shadow-xl animate-in zoom-in-95 duration-200">
        
        {/* 경고 아이콘 */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-error">
          <AlertCircle className="h-6 w-6" strokeWidth={2.5} />
        </div>
        
        {/* 텍스트 영역 */}
        <h3 className="mb-2 text-lg font-bold font-serif text-text">{title}</h3>
        <p className="mb-8 text-sm font-medium text-text-muted">{message}</p>
        
        {/* 버튼 영역 */}
        <div className="flex gap-3">
          <Button 
            onClick={onClose} 
            variant='secondary'
            className="flex-1 rounded-2xl bg-white py-3.5 text-sm font-bold text-text transition-colors hover:bg-gray-50"
          >
            취소
          </Button>
          <Button 
            onClick={onConfirm} 
            className="flex-1 rounded-2xl bg-[#F04444] py-3.5 text-sm font-bold text-white transition-colors hover:bg-red-600"
          >
            삭제
          </Button>
        </div>
        
      </BaseCard>
    </div>
  );
}