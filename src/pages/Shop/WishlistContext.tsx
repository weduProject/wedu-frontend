import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getToken } from '../../lib/apiClient';
import { fetchWishlist, addWishlistItem, removeWishlistItem } from './shopApi';
import { WishlistContext } from './utils/useWishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [wishedIds, setWishedIds] = useState<number[]>([]);

  useEffect(() => {
  if (!getToken()) {
    setWishedIds([]);
    return;
  }
  fetchWishlist()
    .then((productIds) => setWishedIds(productIds)) // 이제 바로 number[] 라서 .map 필요 없음
    .catch((err) => console.warn('찜 목록 조회 실패', err));
}, [user]);

  const isWished = useCallback((id: number) => wishedIds.includes(id), [wishedIds]);

  const toggleWish = useCallback(
    async (id: number) => {
      if (!user) return;
      const wasWished = wishedIds.includes(id);
      setWishedIds((prev) => (wasWished ? prev.filter((wid) => wid !== id) : [...prev, id]));

      try {
        if (wasWished) await removeWishlistItem(id);
        else await addWishlistItem(id);
      } catch (err) {
        setWishedIds((prev) => (wasWished ? [...prev, id] : prev.filter((wid) => wid !== id)));
        console.error('찜하기 실패', err);
      }
    },
    [user, wishedIds],
  );

  const removeWish = useCallback(async (id: number) => {
    setWishedIds((prev) => prev.filter((wid) => wid !== id));
    try {
      await removeWishlistItem(id);
    } catch (err) {
      console.error('찜 삭제 실패', err);
    }
  }, []);

  const clearWishlist = useCallback(async () => {
    const prevIds = wishedIds;
    setWishedIds([]);
    try {
      await Promise.all(prevIds.map((id) => removeWishlistItem(id)));
    } catch (err) {
      setWishedIds(prevIds);
      console.error('찜 전체 삭제 실패', err);
    }
  }, [wishedIds]);

  return (
    <WishlistContext.Provider value={{ wishedIds, isWished, toggleWish, removeWish, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}