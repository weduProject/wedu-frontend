import { PRODUCTS } from './shopData';
import { WEDDING_PRODUCTS } from '../Wedding/weddingData';

// 찜하기/장바구니/상세페이지는 프로포즈 편집샵 상품과 웨딩 견적 상품을 구분 없이
// id로 조회해야 하므로 하나의 풀로 합쳐서 제공한다.
export const ALL_PRODUCTS = [...PRODUCTS, ...WEDDING_PRODUCTS];