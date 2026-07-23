import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

const STORAGE_KEY = 'wedu-wishlist';

interface WishlistContextType {
  wishedIds: number[];
  isWished: (id: number) => boolean;
  toggleWish: (id: number) => void;
  removeWish: (id: number) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// localStorage에서 초기값 불러오기 (없거나 파싱 실패 시 빈 배열)
function loadInitialWishlist(): number[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishedIds, setWishedIds] = useState<number[]>(loadInitialWishlist);

  // wishedIds가 바뀔 때마다 localStorage에 동기화
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishedIds));
  }, [wishedIds]);

  const isWished = useCallback(
    (id: number) => wishedIds.includes(id),
    [wishedIds],
  );

  const toggleWish = useCallback((id: number) => {
    setWishedIds((prev) =>
      prev.includes(id) ? prev.filter((wid) => wid !== id) : [...prev, id],
    );
  }, []);

  const removeWish = useCallback((id: number) => {
    setWishedIds((prev) => prev.filter((wid) => wid !== id));
  }, []);

  const clearWishlist = useCallback(() => {
    setWishedIds([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{ wishedIds, isWished, toggleWish, removeWish, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist는 반드시 WishlistProvider 내부에서 사용되어야 합니다.');
  }
  return context;
};