import { TokenSelect } from './TokenSelect';
import { Label } from './Label';
import type { Token } from '../types';
import styles from './SwapInputGroup.module.css';

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
    <div className={styles.panel}>
      <div className={styles.panelRow}>
        <div className={styles.amountWrapper}>
          <Label htmlFor={id}>{label}</Label>
          <input
            id={id}
            className={`${styles.amountInput} ${error ? styles.inputError : ''}`}
            type="number"
            min="0"
            step="any"
            placeholder={placeholder}
            value={amount}
            onChange={(e) => onAmountChange?.(e.target.value)}
            readOnly={readOnly}
            tabIndex={readOnly ? -1 : undefined}
          />
          {error && <span className={styles.errorMsg}>{error}</span>}
        </div>
        <div className={styles.tokenSelectWrapper}>
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
        <div className={styles.usdValue}>{usdValue}</div>
      )}
    </div>
  );
}
