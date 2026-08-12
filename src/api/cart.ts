import api from './axios';

export const cartApi = {
  // 내 장바구니 조회
  getMyCart: () => 
    api.get('/api/carts/me'),
    
  // 장바구니에 담기
  addItem: (productId: number, quantity: number = 1) => 
    api.post('/api/carts/items', { productId, quantity }),
    
  // 장바구니 상품 수량 변경
  updateItemQuantity: (productId: number, quantity: number) => 
    api.patch(`/api/carts/items/${productId}`, { quantity }),
    
  // 장바구니 삭제
  removeItem: (productId: number) => 
    api.delete(`/api/carts/items/${productId}`),
};
