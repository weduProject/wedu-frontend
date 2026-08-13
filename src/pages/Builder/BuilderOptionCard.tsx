import { Check } from "lucide-react";
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
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative w-full rounded-3xl border p-6 text-left transition-all duration-200 ${
        selected
          ? "border-[#F48171] bg-[#FFF8F5] shadow-md shadow-[#F48171]/10"
          : "border-gray-100 bg-white hover:border-[#F48171]/40 hover:shadow-md"
      }`}
    >
      {selected && (
        <div className="absolute right-5 top-5 flex h-6 w-6 items-center justify-center rounded-full bg-[#F48171] text-white">
          <Check className="h-4 w-4" strokeWidth={3} />
        </div>
      )}

      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0E8] text-[#E27D5F]">
        <BuilderIcon icon={icon} className="h-7 w-7" strokeWidth={2} />
      </div>

      <h3 className="mb-2 text-lg font-bold text-gray-900">
        {title}
      </h3>

      <p className="mb-4 text-sm leading-relaxed text-gray-500">
        {description}
      </p>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-500"
          >
            #{tag}
          </span>
        ))}
      </div>

      {showPrice && (
        <div className="mt-5 text-sm font-bold text-[#F48171]">
          선택하기
        </div>
      )}
    </button>
  );
}
