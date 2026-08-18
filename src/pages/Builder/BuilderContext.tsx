import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { BuilderItem } from "./builderDummy";
import {
  PROPOSAL_CATEGORY,
  selectProposalOption,
  cancelProposalOption,
} from "./builderApi";

export type BuilderState = {
  step: number;
  weddingHall: BuilderItem | null;
  seudeume: BuilderItem | null;
  honeymoon: BuilderItem | null;
  budget: BuilderItem | null;
};

type BuilderContextType = {
  builder: BuilderState;

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

/**
 * 옵션을 선택하면 로컬 상태는 즉시 반영(빠른 UX)하고,
 * 동시에 서버에 선택 현황을 저장한다(POST /api/proposals/options).
 * 서버 저장이 실패해도 빌더 진행 자체는 막지 않고 콘솔에만 경고를 남긴다 —
 * 사용자가 오프라인이거나 백엔드가 아직 준비되지 않은 경우에도 로컬 플로우는 끊기지 않아야 하기 때문.
 */
function syncSelectionToServer(category: keyof typeof PROPOSAL_CATEGORY, item: BuilderItem) {
  selectProposalOption(PROPOSAL_CATEGORY[category], item.id).catch((error) => {
    console.warn(`[proposal] ${category} 선택 서버 동기화 실패:`, error);
  });
}

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [builder, setBuilder] = useState<BuilderState>(INITIAL_STATE);

  const nextStep = () =>
    setBuilder((prev) => ({
      ...prev,
      step: Math.min(prev.step + 1, 4),
    }));

  const prevStep = () =>
    setBuilder((prev) => ({
      ...prev,
      step: Math.max(prev.step - 1, 1),
    }));

  const reset = () => {
    (Object.keys(PROPOSAL_CATEGORY) as Array<keyof typeof PROPOSAL_CATEGORY>).forEach(
      (category) => {
        cancelProposalOption(PROPOSAL_CATEGORY[category]).catch(() => {
          // 취소 실패는 무시 - 서버에 저장된 이전 선택이 없을 수도 있음
        });
      },
    );
    setBuilder(INITIAL_STATE);
  };

  const selectWeddingHall = (item: BuilderItem) => {
    setBuilder((prev) => ({ ...prev, weddingHall: item }));
    syncSelectionToServer("weddingHall", item);
  };

  const selectSeudeume = (item: BuilderItem) => {
    setBuilder((prev) => ({ ...prev, seudeume: item }));
    syncSelectionToServer("seudeume", item);
  };

  const selectHoneymoon = (item: BuilderItem) => {
    setBuilder((prev) => ({ ...prev, honeymoon: item }));
    syncSelectionToServer("honeymoon", item);
  };

  const selectBudget = (item: BuilderItem) => {
    setBuilder((prev) => ({ ...prev, budget: item }));
    syncSelectionToServer("budget", item);
  };

  return (
    <BuilderContext.Provider
      value={{
        builder,
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

  if (!context) {
    throw new Error("BuilderProvider 안에서 사용해야 합니다.");
  }

  return context;
}
