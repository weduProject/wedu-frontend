export function parsePriceToNumber(priceStr: string): number {
  const match = priceStr.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  return Number(match[1]) * 10000;
}

export function formatWon(price: number): string {
  return `₩${new Intl.NumberFormat('ko-KR').format(price)}`;
}