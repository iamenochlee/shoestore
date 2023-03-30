import { BigNumber } from "ethers";
import { create } from "zustand";

interface ReftchStore {
  refetch: (() => void) | null;
  setFetch: (fetchFn: () => void) => void;
}
interface AdminStore {
  isAdmin: boolean;
  setUserIsAdmin: (_: boolean) => void;
}
interface UserTokenBalance {
  balance: null | BigNumber;
  setUserBalance: (_: BigNumber) => void;
}

export const refchListedStore = create<ReftchStore>((set) => ({
  refetch: null,
  setFetch: (fetchFn: () => void) => set((_) => ({ refetch: fetchFn })),
}));

export const refchTransactionsStore = create<ReftchStore>((set) => ({
  refetch: null,
  setFetch: (fetchFn: () => void) => set((_) => ({ refetch: fetchFn })),
}));

export const isAdminStore = create<AdminStore>((set) => ({
  isAdmin: false,
  setUserIsAdmin: (_isAdmin: boolean) => set((_) => ({ isAdmin: _isAdmin })),
}));

export const UserBalanceStore = create<UserTokenBalance>((set) => ({
  balance: null,
  setUserBalance: (bal: BigNumber) => set((_) => ({ balance: bal })),
}));
