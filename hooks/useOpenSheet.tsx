"use client";

import { create } from "zustand";


type EditBackTestState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useEditBackTest = create<EditBackTestState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  })
);