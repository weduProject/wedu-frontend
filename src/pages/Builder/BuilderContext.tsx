import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { BuilderOption } from "./builderDummy";

type BuilderState = {
  step: number;

  weddingHall: string;
  weddingHallPrice: number;

  seudeume: string;
  seudeumePrice: number;

  honeymoon: string;
  honeymoonPrice: number;
};

type BuilderContextType = {
  builder: BuilderState;

  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;

  selectWeddingHall: (item: BuilderOption) => void;
  selectSeudeume: (item: BuilderOption) => void;
  selectHoneymoon: (item: BuilderOption) => void;

  totalPrice: number;
};

const BuilderContext = createContext<BuilderContextType | null>(null);

export function BuilderProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [builder, setBuilder] = useState<BuilderState>({
    step: 1,

    weddingHall: "",
    weddingHallPrice: 0,

    seudeume: "",
    seudeumePrice: 0,

    honeymoon: "",
    honeymoonPrice: 0,
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

      weddingHall: "",
      weddingHallPrice: 0,

      seudeume: "",
      seudeumePrice: 0,

      honeymoon: "",
      honeymoonPrice: 0,
    });

  const selectWeddingHall = (item: BuilderOption) =>
    setBuilder((prev) => ({
      ...prev,
      weddingHall: item.name,
      weddingHallPrice: item.price,
    }));

  const selectSeudeume = (item: BuilderOption) =>
    setBuilder((prev) => ({
      ...prev,
      seudeume: item.name,
      seudeumePrice: item.price,
    }));

  const selectHoneymoon = (item: BuilderOption) =>
    setBuilder((prev) => ({
      ...prev,
      honeymoon: item.name,
      honeymoonPrice: item.price,
    }));

  const totalPrice =
    builder.weddingHallPrice +
    builder.seudeumePrice +
    builder.honeymoonPrice;

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

        totalPrice,
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
