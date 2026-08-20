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
import {
  getLocalRecommendations,
  fetchRecommendations,
  fetchWishlistProductIds,
  addToWishlist,
  removeFromWishlist,
  type RecommendedProduct,
} from "./builderApi";

export default function BuilderCartPage() {
  const navigate = useNavigate();
  const { builder } = useBuilder();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 상품별 찜 상태 + 처리중 여부
  const [wishlistedIds, setWishlistedIds] = useState<Set<number>>(new Set());
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [recommendationError, setRecommendationError] = useState<string | null>(null);

  /**
   * 추천 상품 + 찜 목록을 함께 불러온다.
   * 추천 상품은 실제 API(fetchRecommendations)를 우선 시도하고, 실패하거나
   * 빈 배열이면 로컬 계산(getLocalRecommendations)으로 자연스럽게 폴백한다.
   * 찜 목록은 실패해도 화면 전체가 막히지 않도록 빈 목록으로 처리한다.
   */
  const loadData = async () => {
    setIsLoading(true);
    try {
      setRecommendationError(null);
      let didFail = false;
      const products = await fetchRecommendations().catch((error) => {
        console.warn("추천 상품 API 조회 실패:", error);
        didFail = true;
        return [];
      });

      // 비로그인 상태에서만 로컬 샘플을 화면에 보여준다.
      // 로그인 상태에서 가짜 상품 ID를 찜 API에 보내면 /shop/wishlist가 404로 깨질 수 있으므로
      // 서버 추천 조회에 실패했을 때는 절대로 더미 상품을 찜 목록에 노출하지 않는다.
      if (products.length > 0) {
        setRecommendedProducts(products);
      } else if (!user) {
        setRecommendedProducts(getLocalRecommendations(builder));
      } else if (didFail) {
        setRecommendedProducts([]);
        setRecommendationError("맞춤 추천 상품을 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
      } else {
        // 정상 응답이지만 추천 결과가 없는 경우: 일반 빈 상태 UI를 보여준다.
        setRecommendedProducts([]);
      }

      if (user) {
        const wishlistIds = await fetchWishlistProductIds().catch((error) => {
          console.warn("찜 목록 조회 실패:", error);
          return new Set<number>();
        });
        setWishlistedIds(wishlistIds);
      } else {
        setWishlistedIds(new Set<number>());
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthLoading) return;
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthLoading, user]);

  const totalPrice = recommendedProducts.reduce((sum, p) => sum + p.price, 0);

  /**
   * 찜하기 / 찜 취소 토글.
   * 실제 스펙에는 프로포즈 전용 "장바구니" API가 없어, 담아두는 동작은
   * 문서화된 Wishlist API(POST/DELETE /api/wishlists/items/{productId})로 처리한다.
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

    const isWishlisted = wishlistedIds.has(product.id);
    setPendingIds((prev) => new Set(prev).add(product.id));

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        setWishlistedIds((prev) => {
          const next = new Set(prev);
          next.delete(product.id);
          return next;
        });
      } else {
        await addToWishlist(product.id);
        setWishlistedIds((prev) => new Set(prev).add(product.id));
      }
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
      await Promise.all(targets.map((p) => addToWishlist(p.id)));
      setWishlistedIds((prev) => {
        const next = new Set(prev);
        targets.forEach((p) => next.add(p.id));
        return next;
      });
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

          {isLoading || isAuthLoading ? (
            <div className="flex min-h-[160px] items-center justify-center gap-2 text-sm text-text-muted">
              <Loader2 className="h-5 w-5 animate-spin" />
              추천 상품을 불러오는 중...
            </div>
          ) : recommendationError ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-10 text-center text-text-muted">
              <Sparkles className="h-8 w-8 text-text-muted" />
              <p className="text-sm">{recommendationError}</p>
              <Button variant="secondary" size="sm" onClick={loadData}>다시 시도</Button>
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