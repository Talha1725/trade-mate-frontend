export type SelectedAccountStore = {
  selectedAccountId: string | null;
  setSelectedAccountId: (accountId: string | null) => void;
};
