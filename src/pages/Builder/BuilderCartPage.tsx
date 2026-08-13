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
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleRestart = () => {
    reset();
    navigate("/builder-start");
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  const maxPrice = Math.floor(totalPrice * 1.3);

  return (
    <div className="min-h-screen bg-surface pt-20 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10 px-2">
          <div>
            <h1 className="text-3xl font-bold mb-3 text-gray-900">프로포즈 장바구니</h1>
            <p className="text-gray-500 text-[15px]">선택한 상품들을 확인하고 관리하세요</p>
          </div>
          <button
            onClick={clearCart}
            className="text-[13px] font-medium text-gray-400 hover:text-gray-900 transition-colors"
          >
            전체 비우기
          </button>
        </div>

        <div className="space-y-4 mb-12">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-6 bg-white border border-gray-100 rounded-[1.5rem] shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl text-2xl bg-gray-50">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] text-gray-900">{item.title}</h3>
                    <p className="text-[12px] font-medium text-gray-400 mt-1">{item.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="font-bold text-[16px] text-gray-900">
                    {item.displayPrice}
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors text-lg"
                    aria-label="삭제"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-white border border-gray-100 rounded-[1.5rem] shadow-sm">
              <div className="text-4xl mb-4 opacity-30">🛒</div>
              <p className="text-gray-500 font-medium">장바구니가 비어있습니다.</p>
            </div>
          )}
        </div>

        {/* 예상 금액 카드 */}
        <div className="bg-[#FFF6F5] border border-[#FFE0DC] rounded-[2rem] p-8 md:p-10 mb-10 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#F89685]/20 p-2 rounded-xl text-[#F48171]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            </div>
            <h3 className="font-bold text-xl text-gray-900">예상 금액</h3>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-6 border-b border-[#FFE0DC]/60">
              <span className="text-gray-600 text-[15px] font-medium">선택한 항목</span>
              <span className="font-bold text-gray-900">{cartItems.length}개</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 pt-2">
              <div>
                <span className="text-gray-600 text-[15px] font-medium">예상 총 비용</span>
                <p className="text-[12px] text-gray-400 mt-1">실제 비용은 상세 옵션에 따라 변동될 수 있어요</p>
              </div>
              <span className="text-2xl md:text-[28px] font-bold text-gray-900 tracking-tight">
                {totalPrice === 0 
                  ? "0원" 
                  : `${(totalPrice).toLocaleString()}원 ~ ${(maxPrice).toLocaleString()}원`}
              </span>
            </div>
          </div>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8">
          <Button 
            variant="secondary"
            className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-[15px] bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors border-0" 
            onClick={handleRestart}
          >
            계속 둘러보기
          </Button>
          <Button 
            className="w-full sm:w-auto px-10 py-4 rounded-full font-bold text-[15px] text-white bg-gradient-to-r from-[#F89685] to-[#F2705C] shadow-lg shadow-[#F2705C]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all border-0" 
            onClick={() => navigate("/shop")}
          >
            나만의 프로포즈 다시 만들기
          </Button>
        </div>
      </div>
    </div>
  );
}
