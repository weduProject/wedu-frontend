import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { BuilderItem } from "./builderDummy";

type BuilderState = {
  step: number;

  weddingHall: BuilderItem | null;
  seudeume: BuilderItem |null;
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

export function BuilderProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [builder, setBuilder] = useState<BuilderState>({
    step: 1,

    weddingHall: null,
    seudeume: null,
    honeymoon: null,

    budget: null,
  });

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

  const reset = () =>
    setBuilder({
      step: 1,

      weddingHall: null,
      seudeume: null,
      honeymoon: null,

      budget: null,
    });

  const selectWeddingHall = (item: BuilderItem) =>
    setBuilder((prev) => ({
      ...prev,
      weddingHall: item,
    }));

  const selectSeudeume = (item: BuilderItem) =>
    setBuilder((prev) => ({
      ...prev,
      seudeume: item,
    }));

  const selectHoneymoon = (item: BuilderItem) =>
    setBuilder((prev) => ({
      ...prev,
      honeymoon: item,
    }));

  const selectBudget = (item: BuilderItem) =>
    setBuilder((prev) => ({
      ...prev,
      budget: item,
    }));

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
