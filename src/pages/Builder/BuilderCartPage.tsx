import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components"; 
import { useBuilder } from "./BuilderContext";
import { getRecommendedProducts, type RecommendedItem } from "./builderUtils"; 

export default function BuilderCartPage() {
  const navigate = useNavigate();
  const { builder, reset } = useBuilder();

 
  const [cartItems, setCartItems] = useState<RecommendedItem[]>(() => {
    return getRecommendedProducts(builder);
  });

  const removeItem = (id: number) => {
    setCartItems((prev: RecommendedItem[]) => prev.filter((item: RecommendedItem) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleRestart = () => {
    reset();
    navigate("/builder-start");
  };

  const totalPrice = cartItems.reduce((sum: number, item: RecommendedItem) => sum + item.price, 0);
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
            cartItems.map((item: RecommendedItem) => (
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
