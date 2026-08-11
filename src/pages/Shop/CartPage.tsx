import { useNavigate } from 'react-router-dom';
import { Receipt } from 'lucide-react';
import { useCart } from './CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatWon } from './utils/price';
import { Button, BaseCard } from '../../components';

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl">
        <BaseCard className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-4 text-sm text-[#7C6358]">
            장바구니는 로그인 후 확인할 수 있어요.
          </p>
          <Button variant="wishlist" onClick={() => navigate('/login')}>
            로그인하러 가기
          </Button>
        </BaseCard>
      </div>
    );
  }

  const items = cart?.items ?? [];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">장바구니</h1>

        {items.length > 0 && (
          <Button variant="pill" size="sm" onClick={clearCart}>
            전체 삭제
          </Button>
        )}
      </div>

      <p className="mb-3 text-sm text-text-muted">총 {items.length}개</p>

      {items.length > 0 ? (
        <>
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between rounded-2xl border border-border bg-white p-5"
              >
                <div>
                  <h3 className="text-sm font-semibold text-text">{item.name}</h3>
                  <p className="mt-0.5 text-xs text-text-muted">{formatWon(item.price)}</p>
                </div>

                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-muted hover:bg-[#FAF8F5]"
                      aria-label="수량 감소"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-medium text-text">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-muted hover:bg-[#FAF8F5]"
                      aria-label="수량 증가"
                    >
                      +
                    </button>
                  </div>

                  <span className="w-24 text-right text-sm font-bold text-text">
                    {formatWon(item.subtotal)}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    aria-label="삭제"
                    className="text-text-muted transition-colors hover:text-primary"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[rgba(255,199,190,0.6)] bg-[rgba(255,240,238,0.4)] p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFDED9]">
                <Receipt className="h-4 w-4 text-primary" strokeWidth={2} />
              </div>
              <h2 className="text-lg font-semibold text-[#0C0B0A]">예상 금액</h2>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6F6765]">총 항목</span>
              <span className="text-sm font-semibold text-[#0C0B0A]">{items.length}개</span>
            </div>

            <div className="my-3 h-px bg-[rgba(255,199,190,0.4)]" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6F6765]">예상 총 비용</span>
              <span className="text-xl font-bold text-[#0C0B0A]">{formatWon(cart?.totalPrice ?? 0)}</span>
            </div>

            <p className="mt-3 text-xs text-[#8D8482]">
              실제 비용은 상세 옵션에 따라 변동될 수 있어요
            </p>
          </div>
        </>
      ) : (
        <BaseCard className="flex flex-col items-center justify-center py-20 text-center">
          <p className="mb-4 text-sm text-[#7C6358]">장바구니가 비어있어요.</p>
          <Button variant="wishlist" onClick={() => navigate('/shop')}>
            편집샵 둘러보기
          </Button>
        </BaseCard>
      )}
    </div>
  );
}