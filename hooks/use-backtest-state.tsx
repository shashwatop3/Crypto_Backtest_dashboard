import { create } from "zustand";

export type BacktestState = {
  days: number;
  stop_loss: number;
  take_profit: number;
  initial_capital: number;
  Quantity: number;
};

type BacktestStore = {
  state: BacktestState;
  setBacktestState: (newState: Partial<BacktestState>) => void;
};

export const useBacktestState = create<BacktestStore>((set) => ({
  state: {
    days: 180,
    stop_loss: 0.001,
    take_profit: 0.003,
    initial_capital: 100000,
    Quantity: 0.1,
  },
  setBacktestState: (newState) =>
    set((store) => ({
      state: { ...store.state, ...newState }, // Merge new state with the existing state
    })),
}));
