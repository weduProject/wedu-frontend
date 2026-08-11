import { apiFetch } from '../../lib/apiClient';
import type { ApiEnvelope } from '../../lib/apiClient';
import {
  DECORATIONS_BY_ID,
  DEFAULT_DECORATION_BY_CATEGORY,
  CATEGORY_LABEL,
} from './shopData';
import type { ProductCategory, ProductDecoration } from './shopData';


// Product
export interface ProductSummary {
  id: number;
  name: string;
  category: ProductCategory;
  price: number;
  vendorName: string;
  thumbnailUrl: string;
}

export interface ProductDetailRaw extends ProductSummary {
  description: string;
}

// 화면에서 실제로 쓰는 타입: 백엔드 응답 + 프론트 장식 데이터
export interface DisplayProduct extends ProductSummary, ProductDecoration {
  categoryType: string; 
  title: string;        
  description?: string; 
}

// 백엔드 상품 + 프론트 장식 데이터를 합쳐서 기존 컴포넌트가 쓰던 모양으로 변환
function decorate<T extends ProductSummary & { description?: string }>(product: T): DisplayProduct {
  const decoration = DECORATIONS_BY_ID[product.id] ?? DEFAULT_DECORATION_BY_CATEGORY[product.category];
  return {
    ...product,
    ...decoration,
    categoryType: CATEGORY_LABEL[product.category],
    title: product.name,
    image: decoration.image ?? product.thumbnailUrl,
  };
}

interface FetchProductsParams {
  category?: string;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string[];
}

// GET /api/products
export async function fetchProducts(params: FetchProductsParams = {}): Promise<DisplayProduct[]> {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.keyword) query.set('keyword', params.keyword);
  if (params.minPrice != null) query.set('minPrice', String(params.minPrice));
  if (params.maxPrice != null) query.set('maxPrice', String(params.maxPrice));
  query.set('page', String(params.page ?? 0));
  query.set('size', String(params.size ?? 20));
  (params.sort ?? []).forEach((s) => query.append('sort', s));
  // TODO: pageable 직렬화 방식(단일 query vs 중첩 객체)은 실제 요청 예시로 확인 후 수정

  const res = await apiFetch(`/api/products?${query.toString()}`);
  const body: ApiEnvelope<ProductSummary[]> = await res.json();
  if (!body.success || !body.data) throw new Error(body.error?.message ?? '상품 목록 조회 실패');
  return body.data.map(decorate);
}

// GET /api/products/popular
export async function fetchPopularProducts(): Promise<DisplayProduct[]> {
  const res = await apiFetch('/api/products/popular');
  const body: ApiEnvelope<ProductSummary[]> = await res.json();
  if (!body.success || !body.data) throw new Error(body.error?.message ?? '인기 상품 조회 실패');
  return body.data.map(decorate);
}

// GET /api/products/{productId}
export async function fetchProductDetail(productId: number): Promise<DisplayProduct> {
  const res = await apiFetch(`/api/products/${productId}`);
  const body: ApiEnvelope<ProductDetailRaw> = await res.json();
  if (!body.success || !body.data) throw new Error(body.error?.message ?? '상품 상세 조회 실패');
  return decorate(body.data);
}

// Cart
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  totalPrice: number;
}

// GET /api/carts/me
export async function fetchCart(): Promise<Cart> {
  const res = await apiFetch('/api/carts/me');
  const body: ApiEnvelope<Cart> = await res.json();
  if (!body.success || !body.data) throw new Error(body.error?.message ?? '장바구니 조회 실패');
  return body.data;
}

// POST /api/carts/items
// 주의: 서버가 productId만으로 상품 정보를 조회하는 게 아니라, name/price를 클라이언트가 같이 보내야 함
export async function addCartItem(
  product: { id: number; title: string; price: number },
  quantity = 1,
): Promise<Cart> {
  const res = await apiFetch('/api/carts/items', {
    method: 'POST',
    body: JSON.stringify({
      productId: product.id,
      name: product.title,
      price: product.price,
      quantity,
    }),
  });
  const body: ApiEnvelope<Cart> = await res.json();
  if (!body.success || !body.data) throw new Error(body.error?.message ?? '장바구니 담기 실패');
  return body.data;
}

// PATCH /api/carts/items/{productId}
export async function updateCartItemQuantity(productId: number, quantity: number): Promise<Cart> {
  const res = await apiFetch(`/api/carts/items/${productId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
  const body: ApiEnvelope<Cart> = await res.json();
  if (!body.success || !body.data) throw new Error(body.error?.message ?? '수량 변경 실패');
  return body.data;
}

// DELETE /api/carts/items/{productId}
export async function removeCartItem(productId: number): Promise<Cart> {
  const res = await apiFetch(`/api/carts/items/${productId}`, { method: 'DELETE' });
  const body: ApiEnvelope<Cart> = await res.json();
  if (!body.success || !body.data) throw new Error(body.error?.message ?? '장바구니 삭제 실패');
  return body.data;
}

// Wishlist
// TODO: 실제 응답이 number[]인지 {productId: number}[]인지 확인 후 파싱 부분만 조정
export interface WishlistItem {
  productId: number;
}

// GET /api/wishlists/me
export interface WishlistResponse {
  productIds: number[];
}

export async function fetchWishlist(): Promise<number[]> {
  const res = await apiFetch('/api/wishlists/me');
  const body: ApiEnvelope<WishlistResponse> = await res.json();
  if (!body.success || !body.data) throw new Error(body.error?.message ?? '찜 목록 조회 실패');
  return body.data.productIds;
}

// POST /api/wishlists/items/{productId}
export async function addWishlistItem(productId: number): Promise<void> {
  const res = await apiFetch(`/api/wishlists/items/${productId}`, { method: 'POST' });
  const body: ApiEnvelope<null> = await res.json();
  if (!body.success) throw new Error(body.error?.message ?? '찜하기 실패');
}

// DELETE /api/wishlists/items/{productId}
export async function removeWishlistItem(productId: number): Promise<void> {
  const res = await apiFetch(`/api/wishlists/items/${productId}`, { method: 'DELETE' });
  const body: ApiEnvelope<null> = await res.json();
  if (!body.success) throw new Error(body.error?.message ?? '찜 삭제 실패');
}