import { apiFetch } from '../../lib/apiClient';
import type { ApiEnvelope } from '../../lib/apiClient';
import {
  DECORATIONS_BY_ID,
  DEFAULT_DECORATION_BY_CATEGORY,
  CATEGORY_LABEL,
  CATEGORY_BY_ID,
} from './shopData';
import type { ProductCategory, ProductDecoration } from './shopData';

// ============================================================
// Product
// ============================================================

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

export interface DisplayProduct extends ProductSummary, ProductDecoration {
  categoryType: string;
  title: string;
  description?: string;
}

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
  query.set('size', String(params.size ?? 100));
  (params.sort ?? []).forEach((s) => query.append('sort', s));

  const res = await apiFetch(`/api/products?${query.toString()}`);
  const body: ApiEnvelope<ProductSummary[]> = await res.json();
  if (!body.success || !body.data) throw new Error(body.error?.message ?? '상품 목록 조회 실패');
  return body.data.map(decorate);
}

// GET /api/products/{productId}
export async function fetchProductDetail(productId: number): Promise<DisplayProduct> {
  const res = await apiFetch(`/api/products/${productId}`);
  const body: ApiEnvelope<ProductDetailRaw> = await res.json();
  if (!body.success || !body.data) throw new Error(body.error?.message ?? '상품 상세 조회 실패');
  return decorate(body.data);
}

// ============================================================
// PopularProduct
// ============================================================

export interface PopularProductRaw {
  id: number;
  name: string;
  price: number;
  sourceName: string;
  thumbnailUrl: string;
  rank: number;
}

// thumbnailUrl(예: https://.../products/4.jpg)에서 실제 상품 id를 뽑아냄
// (popular 응답의 id는 실제 상품 id가 아니라 랭킹 테이블 id라서 이렇게 우회함)
function extractRealProductId(thumbnailUrl: string): number | null {
  const match = thumbnailUrl.match(/products\/(\d+)\.jpg/);
  return match ? Number(match[1]) : null;
}

// GET /api/products/popular
export async function fetchPopularProducts(): Promise<DisplayProduct[]> {
  const res = await apiFetch('/api/products/popular');
  const body: ApiEnvelope<PopularProductRaw[]> = await res.json();
  if (!body.success || !body.data) throw new Error(body.error?.message ?? '인기 상품 조회 실패');

  return body.data.map((product) => {
    const realId = extractRealProductId(product.thumbnailUrl) ?? product.id;
    const category = CATEGORY_BY_ID[realId] ?? 'ETC';
    const decoration = DECORATIONS_BY_ID[realId] ?? DEFAULT_DECORATION_BY_CATEGORY[category];

    return {
      id: realId,
      name: product.name,
      category,
      price: product.price,
      vendorName: product.sourceName,
      thumbnailUrl: product.thumbnailUrl,
      ...decoration,
      categoryType: CATEGORY_LABEL[category],
      title: product.name,
      image: product.thumbnailUrl || decoration.image,
    };
  });
}

// ============================================================
// Cart
// ============================================================

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

// ============================================================
// Wishlist
// ============================================================

export interface WishlistResponse {
  productIds: number[];
}

// GET /api/wishlists/me
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