import { PRODUCTS, type Product } from "../Shop/shopData";
import type { BuilderState } from "./BuilderContext"; 

export interface RecommendedItem {
  id: number;
  title: string;
  category: string;
  price: number;
  displayPrice: number;
  icon: string;
}

export function getRecommendedProducts(builder: BuilderState): RecommendedItem[] {
  if (!builder.budget) return [];

  const userString = [
    builder.weddingHall?.name,
    ...(builder.weddingHall?.tags || []),
    builder.seudeume?.name,
    ...(builder.seudeume?.tags || []),
    builder.honeymoon?.name,
    ...(builder.honeymoon?.tags || []),
  ].filter(Boolean).join(" ");

  const budgetId = builder.budget.id;
  let minBudget = 0;
  let maxBudget = Infinity;

  if (budgetId === 1) maxBudget = 1000000;
  else if (budgetId === 2) { minBudget = 1000000; maxBudget = 2000000; }
  else if (budgetId === 3) { minBudget = 2000000; maxBudget = 3000000; }
  else if (budgetId === 4) { minBudget = 3000000; maxBudget = 5000000; }
  else if (budgetId === 5) { minBudget = 5000000; }

  const scoredProducts = PRODUCTS.map((product: Product) => {
    let score = 0;
    product.tags.forEach((tag) => { if (userString.includes(tag)) score += 3; });
    product.styles.forEach((style) => { if (userString.includes(style)) score += 2; });

    const placeName = builder.weddingHall?.name || "";
    const vibeName = builder.seudeume?.name || "";
    const foodName = builder.honeymoon?.name || "";

    if (placeName.includes("호텔") && product.title.includes("호텔")) score += 15;
    if (placeName.includes("야외") && product.tags.includes("해변")) score += 15;
    if (placeName.includes("루프탑") && product.tags.includes("야간")) score += 15;
    if (vibeName.includes("로맨틱") && product.title.includes("플라워")) score += 15;
    if (vibeName.includes("감성") && product.title.includes("포토")) score += 15;
    if (vibeName.includes("우아한") && product.title.includes("현악")) score += 15;
    if (foodName.includes("다이닝") && product.title.includes("다이닝")) score += 15;
    if (foodName.includes("오마카세") && product.title.includes("커스텀")) score += 10;

    const priceNum = product.price;
    return { ...product, score, priceNum };
  });

  let bestCombo: typeof scoredProducts | null = null;
  let maxComboScore = -1;
  let closestCombo: typeof scoredProducts | null = null;
  let minPriceDiff = Infinity;

  for (let i = 0; i < scoredProducts.length - 2; i++) {
    for (let j = i + 1; j < scoredProducts.length - 1; j++) {
      for (let k = j + 1; k < scoredProducts.length; k++) {
        const combo = [scoredProducts[i], scoredProducts[j], scoredProducts[k]];
        const totalPrice = combo[0].priceNum + combo[1].priceNum + combo[2].priceNum;
        
        let comboScore = combo[0].score + combo[1].score + combo[2].score;
        const categories = new Set(combo.map(c => c.categoryType));
        if (categories.size === 3) comboScore += 20; 
        comboScore += Math.random(); 

        if (totalPrice >= minBudget && totalPrice <= maxBudget) {
          if (comboScore > maxComboScore) {
            maxComboScore = comboScore;
            bestCombo = combo;
          }
        }

        let diff = 0;
        if (totalPrice < minBudget) diff = minBudget - totalPrice;
        if (totalPrice > maxBudget) diff = totalPrice - maxBudget;

        if (diff < minPriceDiff) {
          minPriceDiff = diff;
          closestCombo = combo;
        } else if (diff === minPriceDiff && comboScore > (closestCombo ? closestCombo.reduce((a,c)=>a+c.score,0) : 0)) {
          closestCombo = combo;
        }
      }
    }
  }

  const finalCombo = bestCombo || closestCombo || scoredProducts.slice(0, 3);

  return finalCombo.sort((a,b) => b.score - a.score).map((p) => {
    const icon = p.category.split(" ")[0] || "✨";
    return {
      id: p.id,
      title: p.title,
      category: p.categoryType,
      price: p.priceNum,
      displayPrice: p.price,
      icon: icon,
    };
  });
}
