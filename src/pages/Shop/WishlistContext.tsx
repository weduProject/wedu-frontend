import {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { WishlistContext } from './utils/useWishlist';

const STORAGE_KEY_PREFIX = 'wedu-wishlist';

function getStorageKey(userEmail: string | undefined | null): string {
  return userEmail ? `${STORAGE_KEY_PREFIX}-${userEmail}` : `${STORAGE_KEY_PREFIX}-guest`;
}

function loadWishlist(key: string): number[] {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((id): id is number => typeof id === 'number');
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const storageKey = getStorageKey(user?.email);

  const [wishedIds, setWishedIds] = useState<number[]>(() => loadWishlist(storageKey));

  useEffect(() => {
    setWishedIds(loadWishlist(storageKey));
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(wishedIds));
  }, [storageKey, wishedIds]);

  const isWished = useCallback(
    (id: number) => wishedIds.includes(id),
    [wishedIds],
  );

  const toggleWish = useCallback(
    (id: number) => {
      if (!user) {
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