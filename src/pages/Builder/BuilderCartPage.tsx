import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components"; 
import { useBuilder } from "./BuilderContext";
import { PRODUCTS, type Product } from "../Shop/shopData"; 

interface CartItem {
  id: number;
  title: string;
  category: string;
  price: number;
  displayPrice: string;
  icon: string;
}

export default function BuilderCartPage() {
  const navigate = useNavigate();
  const { builder, reset } = useBuilder();

  // BuilderPage와 100% 동일한 조합 탐색 알고리즘
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
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

      const priceNum = parseInt(product.price.replace(/[^0-9]/g, "")) * 10000;
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
  });

  const removeItem = (id: number) => {
    setCartItems((prev: CartItem[]) => prev.filter((item: CartItem) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleRestart = () => {
    reset();
    navigate("/builder-start");
  };

  const totalPrice = cartItems.reduce((sum: number, item: CartItem) => sum + item.price, 0);
  const maxPrice = Math.floor(totalPrice * 1.3);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">프로포즈 장바구니</h1>
          <p className="text-gray-500">선택한 취향과 예산을 바탕으로 구성된 상품들입니다.</p>
        </div>
        <button
          onClick={clearCart}
          className="text-sm text-gray-400 hover:text-gray-600 transition"
        >
          전체 비우기
        </button>
      </div>

      <div className="bg-white rounded-3xl p-2 md:p-4">
        <div className="space-y-4 mb-8">
          {cartItems.length > 0 ? (
            cartItems.map((item: CartItem) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-gray-200 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 flex items-center justify-center rounded-xl text-2xl bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="font-bold text-lg">
                    {item.displayPrice}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-300 hover:text-gray-500 text-xl font-light"
                    aria-label="삭제"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400 border border-dashed rounded-2xl">
              장바구니가 비어있습니다.
            </div>
          )}
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
          <h3 className="font-bold text-xl mb-6">예상 금액</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <span className="text-gray-600">총 항목</span>
              <span className="font-bold">{cartItems.length}개</span>
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-gray-600">예상 총 비용</span>
              <span className="text-2xl font-bold text-primary">
                {totalPrice === 0 
                  ? "0원" 
                  : `${(totalPrice / 10000).toLocaleString()}만원 ~ ${(maxPrice / 10000).toLocaleString()}만원`}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            실제 비용은 상세 옵션에 따라 변동될 수 있어요
          </p>
        </div>

        <div className="flex justify-start gap-3">
          <Button variant="secondary" onClick={() => navigate("/shop")}>
            계속 둘러보기
          </Button>
          <Button onClick={handleRestart}>
            나만의 프로포즈 다시 만들기
          </Button>
        </div>
      </div>
    </div>
  );
}
