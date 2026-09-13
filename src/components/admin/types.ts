import type { TradeInjectionTargetOption, TradePreviewData } from "@/types/admin";

export interface InjectTradeFormProps {
  prompt: string;
  setPrompt: (value: string) => void;
  selectedTargets: string[];
  onToggleTarget: (value: string) => void;
  onSelectAllActive: () => void;
  onClearTargets: () => void;
  onPreview: () => void;
  onInject: () => void;
  isInjecting?: boolean;
  options: TradeInjectionTargetOption[];
}

export interface PreviewPanelProps {
  preview: TradePreviewData | null;
  targetAccountLabel?: string;
}
