"use client";

import { SectionCard } from "@/components/section-card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SparklesIcon, SendIcon } from "lucide-react";
import { mockInjectionTargetOptions } from "@/lib/mock-data/injection";

interface InjectTradeFormProps {
  prompt: string;
  setPrompt: (value: string) => void;
  target: string;
  setTarget: (value: string) => void;
  onPreview: () => void;
  onInject: () => void;
  isInjecting?: boolean;
}

export function InjectTradeForm({
  prompt,
  setPrompt,
  target,
  setTarget,
  onPreview,
  onInject,
  isInjecting = false,
}: InjectTradeFormProps) {
  return (
    <SectionCard title="Natural Language Injection">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">Select Account</label>
          <div className="max-w-xs">
            <Select value={target} onValueChange={(value) => setTarget(value ?? "")}>
              <SelectTrigger id="account-selector">
                <SelectValue placeholder="Select Account" />
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

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground">Instruction</label>
          <Textarea
            id="instruction-textarea"
            placeholder='e.g., Add a trade opened today that made $126 profit'
            className="min-h-[120px] resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Example: <span className="font-mono text-foreground italic">"Add a trade opened today that made $126 profit"</span>
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onPreview}
            disabled={!prompt.trim()}
            className="gap-2"
            id="btn-preview-trade"
          >
            <SparklesIcon className="h-4 w-4 text-amber-500" />
            Preview Trade
          </Button>
          <Button
            type="button"
            onClick={onInject}
            disabled={!prompt.trim() || isInjecting}
            className="gap-2"
            id="btn-inject-trade"
          >
            <SendIcon className="h-4 w-4" />
            {isInjecting ? "Injecting..." : "Inject Trade"}
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
