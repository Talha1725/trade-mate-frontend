export type TradingIndicatorItem = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

export type IndicatorsDropdownProps = {
  indicators?: TradingIndicatorItem[];
  resetTemplateLabel?: string;
  onIndicatorChange?: (id: string, enabled: boolean) => void;
  onResetTemplate?: () => void;
  className?: string;
};
