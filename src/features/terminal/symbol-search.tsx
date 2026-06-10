import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SectionCard } from "@/components/section-card";

export function SymbolSearch() {
  return (
    <SectionCard title="Symbol">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input type="text" placeholder="Search symbol..." className="pl-8" />
        </div>
        <div className="flex items-center gap-4 text-2xl font-bold tracking-tight">
          <span>EURUSD</span>
          <span className="text-emerald-600">1.0850</span>
        </div>
      </div>
    </SectionCard>
  );
}
