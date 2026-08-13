import type { LucideIcon } from 'lucide-react';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText = '로그인하러 가기',
  onAction,
}: EmptyStateProps) {

  const navigate = useNavigate();
  const handleAction = onAction || (() => navigate('/login'));
  
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border py-20 text-center shadow-sm">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-light/50">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <h3 className="mb-2 text-lg font-bold text-text">{title}</h3>
      <p className="mb-6 text-sm text-text-muted">{description}</p>
      <Button onClick={handleAction} className="px-6">
        {actionText}
      </Button>
    </div>
  );
}