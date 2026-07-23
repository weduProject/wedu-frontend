import { Button } from "../../components"; 
import { useBuilder } from "./BuilderContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function BuilderCartPage() {
  const navigate = useNavigate();
  const { reset } = useBuilder(); 

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "한강 뷰 프라이빗 다이닝",
      category: "장소",
      price: 800000,
      icon: "🍽️",
      iconBg: "bg-blue-50 text-blue-500",
    },
    {
      id: 2,
      title: "5성급 호텔 스위트 프로포즈",
      category: "장소",
      price: 1500000,
      icon: "🏨",
      iconBg: "bg-orange-50 text-orange-500",
    },
    {
      id: 3,
      title: "프리미엄 플라워 데코",
      category: "서비스",
      price: 300000,
      icon: "💐",
      iconBg: "bg-pink-50 text-pink-500",
    },
  ]);

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

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">프로포즈 장바구니</h1>
          <p className="text-gray-500">선택한 상품들을 확인하고 관리하세요</p>
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
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-gray-200 transition"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 flex items-center justify-center rounded-xl text-2xl ${item.iconBg}`}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="font-bold text-lg">
                    {item.price.toLocaleString()}원~
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
              <span className="text-2xl font-bold">
                2,210,000원 ~ 3,120,000원
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            실제 비용은 상세 옵션에 따라 변동될 수 있어요
          </p>
        </div>

        <div className="flex justify-start gap-3">
          <Button
            variant="secondary"
            onClick={() => navigate("/shop")}
          >
            계속 둘러보기
          </Button>
          <Button onClick={handleRestart}>
            나만의 프로포즈 다시 만들기
          </Button>
        </div>

        <div className="mt-12 bg-red-50/50 border border-red-100 rounded-2xl p-6 flex gap-4">
          <div className="text-2xl">💡</div>
          <div>
            <h4 className="font-bold text-red-400 mb-1 text-sm">꿀팁</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              장바구니에 담긴 상품들은 마이페이지에서도 확인할 수 있어요. 로그인 후 나만의 프로포즈를 완성하면 자동 저장됩니다. 파트너와 함께 상의하면서 원하는 상품을 추가하거나 제외해보세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
