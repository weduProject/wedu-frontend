import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getToken } from '../../lib/apiClient';
import { fetchCart, addCartItem, updateCartItemQuantity, removeCartItem } from './shopApi';
import type { Cart } from './shopApi';

interface CartContextType {
  cart: Cart | null;
  isInCart: (id: number) => boolean;
  addToCart: (product: { id: number; title: string; price: number }) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    if (!getToken()) {
      setCart(null);
      return;
    }
    fetchCart().then(setCart).catch((err) => console.warn('장바구니 조회 실패', err));
  }, [user]);

  const isInCart = useCallback(
    (id: number) => cart?.items.some((item) => item.productId === id) ?? false,
    [cart],
  );

  const addToCart = useCallback(async (product: { id: number; title: string; price: number }) => {
    if (!user) return;
    try {
      setCart(await addCartItem(product));
    } catch (err) {
      console.error('장바구니 담기 실패', err);
    }
  }, [user]);

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    const prevCart = cart;
    setCart((prev) =>
      prev && {
        ...prev,
        items: prev.items.map((it) =>
          it.productId === productId ? { ...it, quantity, subtotal: it.price * quantity } : it,
        ),
      },
    );
    try {
      setCart(await updateCartItemQuantity(productId, quantity));
    } catch (err) {
      setCart(prevCart ?? null);
      console.error('수량 변경 실패', err);
    }
  }, [cart]);

  const removeFromCart = useCallback(async (productId: number) => {
    const prevCart = cart;
    setCart((prev) => prev && { ...prev, items: prev.items.filter((it) => it.productId !== productId) });
    try {
      setCart(await removeCartItem(productId));
    } catch (err) {
      setCart(prevCart ?? null);
      console.error('삭제 실패', err);
    }
  }, [cart]);

  // 전체 삭제 API가 따로 없어서, 담긴 항목을 하나씩 지우고 최종 상태를 다시 조회함
  const clearCart = useCallback(async () => {
    if (!cart) return;
    const prevCart = cart;
    setCart({ ...cart, items: [], totalPrice: 0 });
    try {
      await Promise.all(prevCart.items.map((item) => removeCartItem(item.productId)));
      setCart(await fetchCart());
    } catch (err) {
      setCart(prevCart);
      console.error('전체 삭제 실패', err);
    }
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, isInCart, addToCart, updateQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart는 반드시 CartProvider 내부에서 사용되어야 합니다.');
  return context;
};