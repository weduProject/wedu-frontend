import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useAuth } from '../../contexts/AuthContext';

const STORAGE_KEY = 'wedu-wishlist';

interface WishlistContextType {
  wishedIds: number[];
  isWished: (id: number) => boolean;
  toggleWish: (id: number) => void;
  removeWish: (id: number) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

function loadInitialWishlist(): number[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishedIds, setWishedIds] = useState<number[]>(loadInitialWishlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishedIds));
  }, [wishedIds]);

  // 로그아웃되면 로컬 찜 목록도 비워서, 다음 사람/비회원이 이전 계정 찜을 보는 문제 방지
  useEffect(() => {
    if (!user) {
      setWishedIds([]);
    }
  }, [user]);

  const isWished = useCallback(
    (id: number) => wishedIds.includes(id),
    [wishedIds],
  );

  const toggleWish = useCallback(
    (id: number) => {
      if (!user) {
        // 비회원은 찜 불가 — 호출부(컴포넌트)에서 로그인 유도 처리
        return;
      }
      setWishedIds((prev) =>
        prev.includes(id) ? prev.filter((wid) => wid !== id) : [...prev, id],
      );
    },
    [user],
  );

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