// Zustand store — implemented in Task 3.
import { create } from "zustand";
import type { ServiceWithAccounts } from "../types";

interface QuotaState {
  services: ServiceWithAccounts[];
  isLoading: boolean;
  setServices: (services: ServiceWithAccounts[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useQuotaStore = create<QuotaState>((set) => ({
  services: [],
  isLoading: false,
  setServices: (services) => set({ services }),
  setLoading: (isLoading) => set({ isLoading }),
}));
