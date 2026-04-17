import { TokenSelect } from './TokenSelect';
import { Label } from './Label';
import type { Token } from '../types';

interface SwapInputGroupProps {
  id: string;
  label: string;
  amount: string;
  onAmountChange?: (value: string) => void;
  token: Token | null;
  onTokenChange: (token: Token) => void;
  tokens: Token[];
  error?: string;
  readOnly?: boolean;
  usdValue?: string;
  placeholder?: string;
}

export function SwapInputGroup({
  id,
  label,
  amount,
  onAmountChange,
  token,
  onTokenChange,
  tokens,
  error,
  readOnly = false,
  usdValue,
  placeholder = '0.00',
}: SwapInputGroupProps) {
  return (
    <div className="bg-input border-[1.5px] border-border rounded-xl p-3 sm:p-4 flex flex-col gap-2 transition-colors focus-within:border-accent">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-3">
        <div className="flex-1 flex flex-col gap-1.5 min-w-0 w-full">
          <Label htmlFor={id}>{label}</Label>
          <input
            id={id}
            className={`border-0 bg-transparent text-2xl sm:text-[28px] font-bold text-text outline-none w-full p-0 tabular-nums appearance-none min-h-9 placeholder:text-text-muted placeholder:font-normal ${error ? 'text-error' : ''}`}
            type="number"
            min="0"
            step="any"
            placeholder={placeholder}
            value={amount}
            onChange={(e) => onAmountChange?.(e.target.value)}
            readOnly={readOnly}
            tabIndex={readOnly ? -1 : undefined}
          />
          {error && <span className="text-xs text-error mt-0.5">{error}</span>}
        </div>
        <div className="shrink-0 w-full sm:w-40 flex flex-col gap-1">
          <Label>Token</Label>
          <TokenSelect
            tokens={tokens}
            value={token}
            onChange={onTokenChange}
            label="Token"
          />
        </div>
      </div>
      {usdValue && (
        <div className="text-sm text-text-muted tabular-nums">{usdValue}</div>
      )}
    </div>
  );
}
