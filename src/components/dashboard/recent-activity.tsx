import { SectionCard } from "@/components/section-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatMarketPrice } from "@/lib/utils/market-price";
import type { RecentActivityProps } from "@/types";

export function RecentActivity({ items }: RecentActivityProps) {
  const data = items ?? [];

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
          {data.length > 0 ? (
            data.map((activity) => (
              <TableRow key={`${activity.symbol}-${activity.dateLabel}`}>
                <TableCell className="font-medium">{activity.symbol}</TableCell>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{formatMarketPrice(activity.price, activity.symbol)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{activity.dateLabel}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                No recent activity.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
