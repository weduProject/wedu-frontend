import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { BuilderItem } from "./builderDummy";

/**
 * ⚠️ 2026-08-21 백엔드 확인 완료: /api/proposals/options는 "장소/분위기/음식/예산" 같은
 * 빌더 개념과 무관하다. category(RING/PHOTO/EVENT/LETTER/FLOWER/ETC)는 상품 종류 슬롯이고
 * productId는 실제 상점 DB에 존재하는 진짜 상품 id여야 한다 — 서버가 그 id로 이름/가격을
 * 조회해 스냅샷 저장하기 때문에, builderDummy.ts의 가짜 로컬 id(1~6)를 보내면 서버에
 * 실제로 존재하는 엉뚱한 상품이 잘못된 카테고리로 저장되는 데이터 오염이 발생한다.
 *
 * 그래서 이 컨텍스트는 백엔드 저장(selectProposalOption/cancelProposalOption/
 * fetchMyProposal) 호출을 전부 제거하고 순수 로컬 상태로만 동작한다.
 * "장소/분위기/예산" 취향 저장이 필요하면 온보딩 심리테스트(POST /api/psychological-tests)
 * 쪽 흐름을 쓰는 게 맞고, "견적에 실제 상품을 담는" 기능이 필요하면 /api/proposals/options에
 * 실제 shopApi 상품(category/productId)을 골라 넣는 방식으로 완전히 새로 설계해야 한다.
 */

export type BuilderState = {
  step: number;
  weddingHall: BuilderItem | null;
  seudeume: BuilderItem | null;
  honeymoon: BuilderItem | null;
  budget: BuilderItem | null;
};

type BuilderContextType = {
  builder: BuilderState;
  isRestoring: boolean;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  selectWeddingHall: (item: BuilderItem) => void;
  selectSeudeume: (item: BuilderItem) => void;
  selectHoneymoon: (item: BuilderItem) => void;
  selectBudget: (item: BuilderItem) => void;
};

const BuilderContext = createContext<BuilderContextType | null>(null);

const INITIAL_STATE: BuilderState = {
  step: 1,
  weddingHall: null,
  seudeume: null,
  honeymoon: null,
  budget: null,
};

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [builder, setBuilder] = useState<BuilderState>(INITIAL_STATE);

  const nextStep = () => setBuilder((prev) => ({ ...prev, step: Math.min(prev.step + 1, 4) }));
  const prevStep = () => setBuilder((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));

  const reset = () => {
    setBuilder(INITIAL_STATE);
  };

  const selectWeddingHall = (item: BuilderItem) =>
    setBuilder((prev) => ({ ...prev, weddingHall: item }));
  const selectSeudeume = (item: BuilderItem) =>
    setBuilder((prev) => ({ ...prev, seudeume: item }));
  const selectHoneymoon = (item: BuilderItem) =>
    setBuilder((prev) => ({ ...prev, honeymoon: item }));
  const selectBudget = (item: BuilderItem) =>
    setBuilder((prev) => ({ ...prev, budget: item }));

  return (
    <BuilderContext.Provider
      value={{
        builder,
        // 백엔드 저장을 안 쓰니 복원할 것도 없다. 항상 false로 두되, BuilderStartPage 등
        // 기존 소비처가 이 값을 참조하고 있어 필드 자체는 남겨둔다.
        isRestoring: false,
        nextStep,
        prevStep,
        reset,
        selectWeddingHall,
        selectSeudeume,
        selectHoneymoon,
        selectBudget,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) throw new Error("BuilderProvider 안에서 사용해야 합니다.");
  return context;
}