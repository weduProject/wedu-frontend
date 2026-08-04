export function groupByCategory<T extends { categoryType: string }>(
  items: T[],
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>((acc, item) => {
    (acc[item.categoryType] ??= []).push(item);
    return acc;
  }, {});
}