"use client";

import { useState } from "react";
import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SendIcon, SparklesIcon } from "lucide-react";
import { allActiveAccountsTarget, mockInjectionTargetOptions } from "@/lib/mock-data/injection";

export function InjectTradeForm() {
  const [prompt, setPrompt] = useState("");
  const [target, setTarget] = useState(allActiveAccountsTarget);

  return (
    <SectionCard title="Natural Language Injection">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-[200px]">
            <Select value={target} onValueChange={(value) => setTarget(value ?? allActiveAccountsTarget)}>
              <SelectTrigger>
                <SelectValue placeholder="Target Account" />
              </SelectTrigger>
              <SelectContent>
                {mockInjectionTargetOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="relative">
          <Textarea 
            placeholder="e.g., Close all EURUSD buy positions and open a 2 lot short on GBPUSD at market."
            className="min-h-[120px] resize-none pb-12"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <SparklesIcon className="h-4 w-4 text-indigo-500" />
              Preview Action
            </Button>
            <Button size="sm" className="gap-2">
              <SendIcon className="h-4 w-4" />
              Execute
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
