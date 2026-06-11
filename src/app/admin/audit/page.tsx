import { AuditTable } from "@/features/admin/audit-table";
import { PageHeader } from "@/components/page-header";

export default function AdminAuditPage() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <PageHeader
        title="Audit Logs"
        description="Comprehensive log of all administrative actions and trade injections."
      />
      <AuditTable />
    </div>
  );
}
