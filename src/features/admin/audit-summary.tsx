import { SectionCard } from "@/components/section-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AuditLogEntry } from "@/types/admin";

const MOCK_AUDITS: AuditLogEntry[] = [
  { id: "LOG-01", timestamp: "2023-10-25 14:30", adminId: "ADM-1", adminEmail: "admin@trademate.app", action: "Inject Trade", targetAccountId: "ACC-1001", details: "Injected BUY 1.0 EURUSD @ Market" },
  { id: "LOG-02", timestamp: "2023-10-25 13:15", adminId: "ADM-1", adminEmail: "admin@trademate.app", action: "Close Position", targetAccountId: "ACC-1002", details: "Closed ticket #10246" },
  { id: "LOG-03", timestamp: "2023-10-24 09:00", adminId: "ADM-2", adminEmail: "support@trademate.app", action: "Account Update", targetAccountId: "ACC-1003", details: "Suspended account due to margin call" },
];

export function AuditSummary() {
  return (
    <SectionCard title="Recent Audit Logs">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Time</TableHead>
              <TableHead className="w-[120px]">Admin</TableHead>
              <TableHead className="w-[140px]">Action</TableHead>
              <TableHead className="w-[120px]">Target</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_AUDITS.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="whitespace-nowrap text-muted-foreground text-xs">{log.timestamp.split(' ')[1]}</TableCell>
                <TableCell className="whitespace-nowrap text-xs">{log.adminEmail.split('@')[0]}</TableCell>
                <TableCell className="whitespace-nowrap font-medium text-xs">{log.action}</TableCell>
                <TableCell className="whitespace-nowrap text-xs">{log.targetAccountId}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
