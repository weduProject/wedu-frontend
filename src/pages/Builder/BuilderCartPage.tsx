import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Loader2,
  Sparkles,
} from "lucide-react";

import { Button } from "../../components";
import { useBuilder } from "./BuilderContext";
import { BuilderIcon } from "./builderIcons";
import { getLocalRecommendations, type RecommendedProduct } from "./builderApi";
import { fetchProducts } from "../Shop/shopApi";
import { useWishlist } from "../Shop/utils/useWishlist";

export default function BuilderCartPage() {
  const navigate = useNavigate();
  const { builder } = useBuilder();
  const { user, isLoading: isAuthLoading } = useAuth();

  // ⚠️ 2026-08-21 확인: Swagger의 "Proposal(나만의 프로포즈 만들기)" 그룹에는
  // 옵션 선택/취소/조회 3개 엔드포인트뿐이고 추천 API가 없다. GET /api/recommendations는
  // 별도 그룹(심리테스트 전용)에 속해있고 빌더의 장소/분위기/음식/예산 선택을 전혀
  // 참조하지 않는다 — 애초에 빌더 도메인과 무관한 API였다. 그래서 서버 호출 없이
  // 실제 상점 상품(fetchProducts) 중에서 로컬로 매칭해서 추천한다. 예전에 가짜
  // id(101~115)를 그대로 쓰던 방식은 찜하기 시 상세조회 404를 유발해서 제거함.
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchProducts({ size: 100 })
      .then((allProducts) => {
        if (cancelled) return;
        setRecommendedProducts(getLocalRecommendations(builder, allProducts));
      })
      .catch((error) => {
        console.warn("상품 목록 조회 실패, 추천 상품을 비웁니다:", error);
        if (!cancelled) setRecommendedProducts([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builder.weddingHall, builder.seudeume, builder.honeymoon, builder.budget]);

  // 찜 상태는 전역 WishlistContext를 그대로 쓴다.
  // (여기서 로컬 상태로 따로 관리하면, /shop/wishlist 등 다른 화면과 상태가
  //  어긋나서 "찜했는데 목록엔 안 보이는" 문제가 생긴다)
  const { wishedIds, toggleWish } = useWishlist();
  const wishlistedIds = new Set(wishedIds);
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);

  const totalPrice = recommendedProducts.reduce((sum, p) => sum + p.price, 0);

  /**
   * 찜하기 / 찜 취소 토글.
   * 실제 스펙에는 프로포즈 전용 "장바구니" API가 없어, 담아두는 동작은
   * 문서화된 Wishlist API(POST/DELETE /api/wishlists/items/{productId})로 처리한다.
   * recommendedProducts가 이제 항상 실제 상점 상품이라 별도 예외 처리 없이
   * 바로 찜 API를 호출해도 안전하다.
   */
  const requireLogin = () => {
    setShowLoginModal(true);
  };

  const toggleWishlist = async (product: RecommendedProduct) => {
    if (!user) {
      requireLogin();
      return;
    }
    if (pendingIds.has(product.id)) return;

    setPendingIds((prev) => new Set(prev).add(product.id));
    try {
      await toggleWish(product.id);
    } catch (error) {
      console.error("찜하기 처리 실패:", error);
      alert("찜하기 처리에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }
  };

  const handleAddAllToWishlist = async () => {
    if (!user) {
      requireLogin();
      return;
    }

    const targets = recommendedProducts.filter((p) => !wishlistedIds.has(p.id));
    if (targets.length === 0) {
      alert("이미 모든 추천 상품을 찜하셨어요.");
      return;
    }

    setPendingIds((prev) => {
      const next = new Set(prev);
      targets.forEach((p) => next.add(p.id));
      return next;
    });

    try {
      await Promise.all(targets.map((p) => toggleWish(p.id)));
      alert("추천 상품을 찜 목록에 담았습니다.");
    } catch (error) {
      console.error("추천 상품 찜하기 실패:", error);
      alert("찜하기에 실패했습니다.");
    } finally {
      setPendingIds((prev) => {
        const next = new Set(prev);
        targets.forEach((p) => next.delete(p.id));
        return next;
      });
    }
  };

  return (
    <div className="bg-surface -mx-5 -mt-5 -mb-5 md:-mx-8 md:-mt-8 md:-mb-8">
      <div className="max-w-4xl mx-auto px-5 py-16 md:px-8">

        {/* 뒤로가기 */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate("/builder")}
          className="mb-8 flex items-center gap-2 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
          빌더로 돌아가기
        </Button>

        {/* 제목 */}
        <div className="mb-10">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
              <ShoppingCart className="h-6 w-6" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-text">
                맞춤 추천 결과
              </h1>

              <p className="mt-1 text-sm text-text-muted">
                선택하신 스타일과 예산에 맞춰 추천된 상품이에요. 마음에 드는 상품을 찜해보세요.
              </p>
            </div>
          </div>
        </div>

        {/* 추천 상품 */}
        <div className="rounded-[2rem] border border-primary-light bg-surface p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text">
                빌더 추천 상품
              </h2>

              <p className="mt-1 text-sm text-text-muted">
                선택하신 조건에 맞춰 추천된 상품입니다.
              </p>
            </div>

            {!isLoading && recommendedProducts.length > 0 && (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-primary">
                {recommendedProducts.length}개
              </span>
            )}
          </div>

          {isAuthLoading || isLoading ? (
            <div className="flex min-h-[160px] items-center justify-center gap-2 text-sm text-text-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
              추천 상품을 불러오는 중...
            </div>
          ) : recommendedProducts.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-10 text-center text-text-muted">
              <Sparkles className="h-8 w-8 text-text-muted" />
              <p className="text-sm">선택한 조건에 맞는 추천 상품이 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="mb-6 space-y-3">
                {recommendedProducts.map((product) => {
                  const isWishlisted = wishlistedIds.has(product.id);
                  const isPending = pendingIds.has(product.id);

                  return (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white bg-white p-4 shadow-sm"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                          <BuilderIcon icon={product.iconKey} className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-text">
                            {product.title}
                          </p>

                          <p className="mt-1 text-xs text-text-muted">
                            {product.category}
                          </p>

                          {product.reason && (
                            <p className="mt-1 text-xs italic text-primary/70">
                              {product.reason}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-sm font-bold text-text">
                          {product.price.toLocaleString()}원
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleWishlist(product)}
                          disabled={isPending}
                          aria-pressed={isWishlisted}
                          className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                            isWishlisted
                              ? "border-primary bg-primary-light text-primary"
                              : "border-border text-text-muted hover:text-primary"
                          } ${isPending ? "opacity-50" : ""}`}
                        >
                          {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Heart className="h-4 w-4" fill={isWishlisted ? "currentColor" : "none"} />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={handleAddAllToWishlist}
                className="w-full py-3.5"
              >
                추천 상품 모두 찜하기
                <Heart className="ml-2 inline h-4 w-4" />
              </Button>

              <div className="mt-6 flex items-center justify-between border-t border-white pt-6">
                <span className="font-bold text-text">
                  추천 상품 합계
                </span>

                <span className="text-2xl font-bold text-primary">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <Button variant="secondary" onClick={() => navigate("/shop/wishlist")}>
            찜 목록 전체 보기
          </Button>
        </div>
      </div>

      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5"
          role="presentation"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="builder-login-modal-title"
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="builder-login-modal-title" className="text-lg font-bold text-text">
              로그인이 필요한 기능이에요
            </h2>
            <p className="mt-3 text-sm leading-6 text-text-muted">
              찜하기는 로그인 후 이용할 수 있어요. 로그인하고 다시 시도해주세요.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowLoginModal(false)}
              >
                취소
              </Button>
              <Button
                className="flex-1"
                onClick={() => navigate("/login", { state: { from: "/builder/cart" } })}
              >
                로그인하러 가기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}