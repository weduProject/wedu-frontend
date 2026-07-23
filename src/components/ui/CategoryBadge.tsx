interface CategoryBadgeProps {
  category: string;
}

export default function CategoryBadge({
  category,
}: CategoryBadgeProps) {
  return (
    <span className="text-primary font-semibold text-sm">
      {category}
    </span>
  );
}
