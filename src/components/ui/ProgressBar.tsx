interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
}

export default function ProgressBar({ value, max = 100, showLabel = false }: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className="flex items-center gap-2"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className="flex-1 h-2 bg-[#f0f0f0] rounded overflow-hidden">
        <div
          className="h-full bg-[linear-gradient(to_right,#B76E79_0%,#D4A373_100%)] rounded transition-[width] duration-300 ease-in-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-text-muted min-w-[36px]">{Math.round(percent)}%</span>
      )}
    </div>
  );
}
