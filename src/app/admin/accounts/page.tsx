import { AccountsTable } from "@/components/admin/accounts-table";
import { PageHeader } from "@/components/page-header";

export default function AdminAccountsPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        title="Account Management"
        description="View and manage user accounts, equity, and statuses."
      />
      <AccountsTable />
    </div>
  );
}
