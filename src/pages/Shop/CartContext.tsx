import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'wedu-cart';

interface CartContextType {
  cartIds: number[];
  isInCart: (id: number) => boolean;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadInitialCart(): number[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartIds, setCartIds] = useState<number[]>(loadInitialCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartIds));
  }, [cartIds]);

  const isInCart = useCallback(
    (id: number) => cartIds.includes(id),
    [cartIds],
  );

  const addToCart = useCallback((id: number) => {
    setCartIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCartIds((prev) => prev.filter((cid) => cid !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartIds([]);
  }, []);

  return (
    <CartContext.Provider
      value={{ cartIds, isInCart, addToCart, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart는 반드시 CartProvider 내부에서 사용되어야 합니다.');
  }
  return context;
};