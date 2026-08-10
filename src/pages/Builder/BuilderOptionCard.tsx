interface Props {
  title: string;
  description: string;
  tags: string[];
  icon: string;
  price?: number;
  showPrice?: boolean;
  selected: boolean;
  onClick: () => void;
}

export default function BuilderOptionCard({
  title,
  description,
  tags,
  icon,
  price,
  showPrice = true,
  selected,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative w-full rounded-3xl border overflow-hidden text-left transition-all duration-300
        ${selected
          ? "border-[#F48171] bg-[#FFF9F8] ring-1 ring-[#F48171]"
          : "border-gray-200 bg-white hover:border-[#F48171]/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] hover:-translate-y-1"
        }
      `}
    >
      <div className="p-7">
        {selected && (
          <div className="absolute top-5 right-5 w-6 h-6 rounded-full bg-[#F48171] flex items-center justify-center text-white text-xs font-bold shadow-sm">
            ✓
          </div>
        )}

        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="w-12 h-12 flex items-center justify-start text-3xl mb-4 transition-transform duration-300 group-hover:scale-110">
              {icon}
            </div>
            <h3 className="font-bold text-[17px] text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-[#888888] text-[13px] leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>

          <div className="mt-5">
            {showPrice && price !== undefined && (
              <p className="text-[15px] font-bold text-gray-900 mb-4">
                {price.toLocaleString()}원
              </p>
            )}

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100/80 px-3 py-1.5 text-[11px] font-bold text-gray-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
