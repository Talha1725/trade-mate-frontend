export type SelectedAccountStore = {
  selectedAccountId: string | null;
  setSelectedAccountId: (accountId: string | null) => void;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
};
