import { SectionCard } from "@/components/section-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockRecentActivity } from "@/lib/mock-data/dashboard";


export function RecentActivity() {
  return (
    <SectionCard title="Recent Activity">
      <div className="rounded-md border">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockRecentActivity.map((activity) => (
            <TableRow key={`${activity.symbol}-${activity.dateLabel}`}>
              <TableCell className="font-medium">{activity.symbol}</TableCell>
              <TableCell>{activity.action}</TableCell>
              <TableCell>{activity.price.toFixed(4)}</TableCell>
              <TableCell className="text-right text-muted-foreground">{activity.dateLabel}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
