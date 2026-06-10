import { SectionCard } from "@/components/section-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


export function OpenPositionsSummary() {
  return (
    <SectionCard title="Open Positions Summary">
      <div className="rounded-md border">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead className="text-right">P/L</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">EURUSD</TableCell>
            <TableCell className="text-emerald-600">Buy</TableCell>
            <TableCell>1.0</TableCell>
            <TableCell className="text-right text-emerald-600">+$45.20</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">GBPUSD</TableCell>
            <TableCell className="text-rose-600">Sell</TableCell>
            <TableCell>0.5</TableCell>
            <TableCell className="text-right text-rose-600">-$12.50</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">XAUUSD</TableCell>
            <TableCell className="text-emerald-600">Buy</TableCell>
            <TableCell>0.1</TableCell>
            <TableCell className="text-right text-emerald-600">+$150.00</TableCell>
          </TableRow>
        </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
