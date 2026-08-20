import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { ReactNode } from "react";
import type { BuilderItem } from "./builderDummy";
import { weddingHallList, seudeumeList, honeymoonList, budgetList } from "./builderDummy";
import {
  cancelProposalOption,
  fetchMyProposal,
  PROPOSAL_CATEGORY,
  selectProposalOption,
} from "./builderApi";
import { getToken } from "../../lib/apiClient";

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

function itemFromSelection(
  optionId: number,
  lists: BuilderItem[],
): BuilderItem | null {
  return lists.find((item) => item.id === optionId) ?? null;
}

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [builder, setBuilder] = useState<BuilderState>(INITIAL_STATE);
  const [isRestoring, setIsRestoring] = useState(true);
  const { user, isLoading: isAuthLoading } = useAuth();

  useEffect(() => {
    if (isAuthLoading) {
      setIsRestoring(true);
      return;
    }

    if (!user || !getToken()) {
      setIsRestoring(false);
      return;
    }

    let cancelled = false;
    setIsRestoring(true);

    fetchMyProposal()
      .then((proposal) => {
        if (cancelled) return;
        setBuilder((prev) => ({
          ...prev,
          weddingHall: proposal.selections[PROPOSAL_CATEGORY.weddingHall]
            ? itemFromSelection(proposal.selections[PROPOSAL_CATEGORY.weddingHall]!.optionId, weddingHallList)
            : null,
          seudeume: proposal.selections[PROPOSAL_CATEGORY.seudeume]
            ? itemFromSelection(proposal.selections[PROPOSAL_CATEGORY.seudeume]!.optionId, seudeumeList)
            : null,
          honeymoon: proposal.selections[PROPOSAL_CATEGORY.honeymoon]
            ? itemFromSelection(proposal.selections[PROPOSAL_CATEGORY.honeymoon]!.optionId, honeymoonList)
            : null,
          budget: proposal.selections[PROPOSAL_CATEGORY.budget]
            ? itemFromSelection(proposal.selections[PROPOSAL_CATEGORY.budget]!.optionId, budgetList)
            : null,
        }));
      })
      .catch((error) => {
        console.warn("내 프로포즈 선택 현황 복원 실패:", error);
      })
      .finally(() => {
        if (!cancelled) setIsRestoring(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthLoading, user]);

  const nextStep = () => setBuilder((prev) => ({ ...prev, step: Math.min(prev.step + 1, 4) }));
  const prevStep = () => setBuilder((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));

  const reset = () => {
    setBuilder(INITIAL_STATE);
    if (getToken()) {
      void Promise.all(
        Object.values(PROPOSAL_CATEGORY).map((category) =>
          cancelProposalOption(category).catch((error) =>
            console.warn(`프로포즈 ${category} 선택 취소 실패:`, error),
          ),
        ),
      );
    }
  };

  const saveSelection = async (
    category: keyof typeof PROPOSAL_CATEGORY,
    item: BuilderItem,
    setter: (prev: BuilderState) => BuilderState,
  ) => {
    const previous = builder;
    const previousCategoryValue = previous[category];
    setBuilder(setter);

    if (!getToken()) return;

    try {
      await selectProposalOption(PROPOSAL_CATEGORY[category], item.id);
    } catch (error) {
      setBuilder((prev) => ({ ...prev, [category]: previousCategoryValue }));
      console.error("프로포즈 옵션 저장 실패:", error);
      window.alert("선택한 프로포즈 옵션을 저장하지 못했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  const selectWeddingHall = (item: BuilderItem) =>
    void saveSelection("weddingHall", item, (prev) => ({ ...prev, weddingHall: item }));
  const selectSeudeume = (item: BuilderItem) =>
    void saveSelection("seudeume", item, (prev) => ({ ...prev, seudeume: item }));
  const selectHoneymoon = (item: BuilderItem) =>
    void saveSelection("honeymoon", item, (prev) => ({ ...prev, honeymoon: item }));
  const selectBudget = (item: BuilderItem) =>
    void saveSelection("budget", item, (prev) => ({ ...prev, budget: item }));


  return (
    <BuilderContext.Provider
      value={{
        builder,
        isRestoring,
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
