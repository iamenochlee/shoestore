import { create } from "zustand";

interface MyStoreState {
  refetch: (() => void) | null;
  setFetch: (fetchFn: () => void) => void;
}

export const refchListedStore = create<MyStoreState>((set) => ({
  refetch: null,
  setFetch: (fetchFn: () => void) => set((_) => ({ refetch: fetchFn })),
}));
