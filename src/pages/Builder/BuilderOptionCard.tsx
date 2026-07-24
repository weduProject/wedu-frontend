interface Props {
  title: string;
  description: string;
  tags: string[];
  icon: string;
  price?: number;
  showPrice?: boolean;
  selected: boolean;
  onClick: () => void;
  showCheckmark?: boolean;
}

const iconColors: Record<string, string> = {
  "🏙️": "bg-blue-100",
  "🏨": "bg-purple-100",
  "🌅": "bg-orange-100",
  "🌹": "bg-pink-100",
  "✨": "bg-violet-100",
  "☕": "bg-amber-100",
  "🍽️": "bg-green-100",
  "🥩": "bg-red-100",
  "🍣": "bg-cyan-100",
  "🌿": "bg-green-100",
  "🎡": "bg-yellow-100",
  "🧺": "bg-orange-100",
  "🌃": "bg-indigo-100",
  "🏡": "bg-emerald-100",
  "🕯️": "bg-amber-100",
  "🎉": "bg-pink-100",
  "💖": "bg-rose-100",
  "🍷": "bg-red-100",
  "🍚": "bg-yellow-100",
  "🍰": "bg-pink-100",
};

export default function BuilderOptionCard({
  title,
  description,
  tags,
  icon,
  price,
  showPrice = true,
  selected,
  onClick,
  showCheckmark = true,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        w-full
        rounded-2xl
        border
        overflow-hidden
        bg-white
        text-left
        transition-all
        duration-300
        ${
          selected
            ? "border-primary bg-primary/5 ring-2 ring-primary/20 scale-[1.02] shadow-lg"
            : "border-gray-200 hover:border-primary hover:shadow-lg hover:-translate-y-1"
        }
      `}
    >

      <div className="p-6">

        <div className="flex justify-between items-start">

          <div className="flex gap-4">

            <div
              className={`
                w-14
                h-14
                rounded-2xl
                flex
                items-center
                justify-center
                text-3xl
                transition
                group-hover:scale-110
                ${iconColors[icon] ?? "bg-gray-100"}
              `}
            >
              {icon}
            </div>

            <div>

              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xl">
                  {title}
                </h3>

              </div>

              <p className="text-gray-500 mt-2 leading-6">
                {description}
              </p>

            </div>

          </div>

          <div className="text-right">

            {showPrice && price !== undefined && (
              <p className="text-xl font-bold text-primary">
                {price.toLocaleString()}원
              </p>
            )}

            {selected && showCheckmark && (
              <div
                className="
                  mt-3
                  inline-flex
                  items-center
                  rounded-full
                  bg-primary
                  text-white
                  px-3
                  py-1
                  text-xs
                  font-semibold
                "
              >
                ✓
              </div>
            )}

          </div>

        </div>

        <div className="flex flex-wrap gap-2 mt-6">

          {tags.map((tag) => (
            <span
              key={tag}
              className="
                rounded-full
                bg-gray-100
                px-3
                py-1.5
                text-xs
                font-medium
                text-gray-600
              "
            >
              #{tag}
            </span>
          ))}

        </div>

      </div>
    </button>
  );
}
