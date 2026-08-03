import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from './shopData';
import { useCart } from './CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { parsePriceToNumber, formatWon } from './utils/price';
import { Button, BaseCard, CategoryBadge } from '../../components';

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartIds, removeFromCart, clearCart } = useCart();

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

  const cartProducts = PRODUCTS.filter((product) => cartIds.includes(product.id));
  const totalPrice = cartProducts.reduce(
    (sum, product) => sum + parsePriceToNumber(product.price),
    0,
  );

  const groupedProducts = cartProducts.reduce<Record<string, typeof cartProducts>>(
    (acc, product) => {
      (acc[product.categoryType] ??= []).push(product);
      return acc;
    },
    {},
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">장바구니</h1>

        {cartProducts.length > 0 && (
          <Button variant="pill" size="sm" onClick={clearCart}>
            전체 삭제
          </Button>
        )}
      </div>

      <p className="mb-3 text-sm text-text-muted">총 {cartProducts.length}개</p>

      {cartProducts.length > 0 ? (
        <>
          <div className="flex flex-col gap-8">
            {Object.entries(groupedProducts).map(([label, products]) => (
              <section key={label}>
                <h2 className="mb-3 text-sm font-semibold text-text-muted">
                  {label} · {products.length}개
                </h2>
                <div className="flex flex-col gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between rounded-2xl border border-border bg-white p-5"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 overflow-hidden rounded-xl bg-primary-light">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <CategoryBadge category={product.category} />
                          <h3 className="text-sm font-semibold text-text mt-0.5">
                            {product.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-5">
                        <span className="text-sm font-bold text-text">{product.price}</span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          aria-label="삭제"
                          className="text-text-muted transition-colors hover:text-primary"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <BaseCard className="mt-8" title="예상 금액">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <span className="text-text-muted">총 항목</span>
              <span className="font-bold text-text">{cartProducts.length}개</span>
            </div>

            <div className="flex items-center justify-between pt-4">
              <span className="text-text-muted">예상 총 비용</span>
              <span className="text-2xl font-bold text-text">
                {formatWon(totalPrice)}~
              </span>
            </div>

            <p className="mt-4 text-xs text-text-muted">
              실제 비용은 상세 옵션에 따라 변동될 수 있어요
            </p>
          </BaseCard>
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