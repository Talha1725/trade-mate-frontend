import { SectionCard } from "@/components/section-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockAudits } from "@/lib/mock-data/audits";

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
            {mockAudits.map((log) => (
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
