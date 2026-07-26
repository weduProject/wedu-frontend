import { createContext, useContext } from 'react';

export interface WishlistContextType {
  wishedIds: number[];
  isWished: (id: number) => boolean;
  toggleWish: (id: number) => void;
  removeWish: (id: number) => void;
  clearWishlist: () => void;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist는 반드시 WishlistProvider 내부에서 사용되어야 합니다.');
  }
  return context;
};