import { Check } from "lucide-react";
import { SelectableCard } from "../../components";
import { BuilderIcon } from "./builderIcons";

interface Props {
  title: string;
  description: string;
  tags: string[];
  icon: string;
  selected: boolean;
  onClick: () => void;
  showPrice?: boolean;
}

export default function BuilderOptionCard({
  title,
  description,
  tags,
  icon,
  selected,
  onClick,
  showPrice = false,
}: Props) {
  return (
    <SelectableCard
      isSelected={selected}
      onClick={onClick}
      className="relative"
    >
      {selected && (
        <div className="absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
          <Check className="h-4 w-4" strokeWidth={3} />
        </div>
      )}

      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
        <BuilderIcon icon={icon} className="h-7 w-7" strokeWidth={2} />
      </div>

      <h3 className="mb-2 text-lg font-bold text-text">
        {title}
      </h3>

      <p className="mb-4 text-sm leading-relaxed text-text-muted">
        {description}
      </p>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-text-muted"
          >
            #{tag}
          </span>
        ))}
      </div>

      {showPrice && (
        <div className="mt-5 text-sm font-bold text-primary">
          선택하기
        </div>
      )}
    </SelectableCard>
  );
}