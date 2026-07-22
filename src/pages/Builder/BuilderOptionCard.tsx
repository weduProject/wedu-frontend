interface Props {
  title: string;
  price: number;
  selected: boolean;
  onClick: () => void;
}

export default function BuilderOptionCard({
  title,
  price,
  selected,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-primary bg-primary/10"
          : "border-gray-200 hover:border-primary"
      }`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">
            {title}
          </h3>

          <p className="text-gray-500 mt-2">
            {price.toLocaleString()}원
          </p>
        </div>

        {selected && (
          <div className="text-primary font-bold">
            ✓ 선택됨
          </div>
        )}
      </div>
    </button>
  );
}
