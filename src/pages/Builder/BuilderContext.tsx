import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { BuilderItem } from "./builderDummy";

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
    setBuilder(INITIAL_STATE);
  };

  // 옵션 선택은 로컬 상태로만 관리한다.
  // (백엔드에 선택 저장 API가 아직 없어 매 클릭마다 네트워크 에러가 나던 문제를 제거함.
  //  API가 준비되면 여기서 builderApi.selectProposalOption(...)을 호출하도록 연결하면 됨.)
  const selectWeddingHall = (item: BuilderItem) => {
    setBuilder((prev) => ({ ...prev, weddingHall: item }));
  };

  const selectSeudeume = (item: BuilderItem) => {
    setBuilder((prev) => ({ ...prev, seudeume: item }));
  };

  const selectHoneymoon = (item: BuilderItem) => {
    setBuilder((prev) => ({ ...prev, honeymoon: item }));
  };

  const selectBudget = (item: BuilderItem) => {
    setBuilder((prev) => ({ ...prev, budget: item }));
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
