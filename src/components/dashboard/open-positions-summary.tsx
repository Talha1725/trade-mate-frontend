import { SectionCard } from "@/components/section-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { OpenPositionsSummaryProps } from "@/types";

export function OpenPositionsSummary({ positions }: OpenPositionsSummaryProps) {
  const data = positions ?? [];

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
          {data.length > 0 ? (
            data.map((position) => (
              <TableRow key={position.id}>
                <TableCell className="font-medium">{position.symbol}</TableCell>
                <TableCell className={position.type === "Buy" ? "text-emerald-600" : "text-rose-600"}>
                  {position.type}
                </TableCell>
                <TableCell>{position.volume}</TableCell>
                <TableCell className={`text-right ${position.profit > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                  {position.profit > 0 ? "+" : ""}${position.profit.toFixed(2)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                No open positions.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        </Table>
      </div>
    </SectionCard>
  );
}
