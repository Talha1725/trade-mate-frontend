import { SectionCard } from "@/components/section-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockPositionSummary } from "@/lib/mock-data/dashboard";


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
          {mockPositionSummary.map((position) => (
            <TableRow key={position.symbol}>
              <TableCell className="font-medium">{position.symbol}</TableCell>
              <TableCell className={position.type === "Buy" ? "text-emerald-600" : "text-rose-600"}>
                {position.type}
              </TableCell>
              <TableCell>{position.volume}</TableCell>
              <TableCell className={`text-right ${position.profit > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                {position.profit > 0 ? "+" : ""}${position.profit.toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
