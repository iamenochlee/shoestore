import { BigNumber } from "ethers";
import { create } from "zustand";

interface MyStoreState {
  refetch: (() => void) | null;
  setFetch: (fetchFn: () => void) => void;
}
interface AdminStore {
  isAdmin: boolean;
  setUserIsAdmin: (_: boolean) => void;
}
interface UserBalsnce {
  balance: null | BigNumber;
  setUserBalance: (_: BigNumber) => void;
}

export const refchListedStore = create<MyStoreState>((set) => ({
  refetch: null,
  setFetch: (fetchFn: () => void) => set((_) => ({ refetch: fetchFn })),
}));

export const refchTransactionsStore = create<MyStoreState>((set) => ({
  refetch: null,
  setFetch: (fetchFn: () => void) => set((_) => ({ refetch: fetchFn })),
}));

export const isAdminStore = create<AdminStore>((set) => ({
  isAdmin: false,
  setUserIsAdmin: (_isAdmin: boolean) => set((_) => ({ isAdmin: _isAdmin })),
}));

export const UserBalanceStore = create<UserBalsnce>((set) => ({
  balance: null,
  setUserBalance: (bal: BigNumber) => set((_) => ({ balance: bal })),
}));
