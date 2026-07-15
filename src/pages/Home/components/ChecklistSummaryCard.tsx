import BaseCard from '../../../components/ui/BaseCard';

export default function ChecklistSummaryCard() {
  return (
    <BaseCard title="체크리스트">
      <p className="text-lg font-bold mt-1">
        OO / OO
        <span className="text-sm font-normal text-text-muted ml-1">완료</span>
      </p>
      <p className="text-xs text-text-muted mt-2">체크리스트를 작성하면 현황이 표시됩니다.</p>
    </BaseCard>
  );
}
