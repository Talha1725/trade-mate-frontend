import { SectionCard } from "@/components/section-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


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
          <TableRow>
            <TableCell className="font-medium">EURUSD</TableCell>
            <TableCell>Buy</TableCell>
            <TableCell>1.0850</TableCell>
            <TableCell className="text-right text-muted-foreground">10 mins ago</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">GBPUSD</TableCell>
            <TableCell>Sell</TableCell>
            <TableCell>1.2640</TableCell>
            <TableCell className="text-right text-muted-foreground">1 hr ago</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">XAUUSD</TableCell>
            <TableCell>Close Buy</TableCell>
            <TableCell>2045.50</TableCell>
            <TableCell className="text-right text-muted-foreground">3 hrs ago</TableCell>
          </TableRow>
        </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
