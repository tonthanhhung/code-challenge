/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
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
    <Panel>
      <PanelRow>
        <AmountWrapper>
          <Label htmlFor={id}>{label}</Label>
          <AmountInput
            id={id}
            type="number"
            min="0"
            step="any"
            placeholder={placeholder}
            value={amount}
            onChange={(e) => onAmountChange?.(e.target.value)}
            readOnly={readOnly}
            tabIndex={readOnly ? -1 : undefined}
            hasError={!!error}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </AmountWrapper>
        <TokenSelectWrapper>
          {/* TokenSelect has its own built-in label */}
          <TokenSelect
            tokens={tokens}
            value={token}
            onChange={onTokenChange}
            label="Token"
          />
        </TokenSelectWrapper>
      </PanelRow>
      {usdValue && <UsdValue>{usdValue}</UsdValue>}
    </Panel>
  );
}

// Styled Components
const Panel = styled.div`
  background: #f7f8ff;
  border: 1.5px solid #e4e6f0;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.15s;

  &:focus-within {
    border-color: #6c47ff;
  }

  @media (min-width: 480px) {
    padding: 16px;
  }
`;

const PanelRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 480px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 12px;
  }
`;

const AmountWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  width: 100%;
`;

const AmountInput = styled.input<{ hasError?: boolean }>`
  border: none;
  background: transparent;
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.hasError ? '#e53e3e' : '#1a1a2e'};
  outline: none;
  width: 100%;
  padding: 0;
  font-variant-numeric: tabular-nums;
  appearance: none;
  min-height: 36px;

  @media (min-width: 480px) {
    font-size: 28px;
  }

  &::placeholder {
    color: #8b8fa8;
    font-weight: 400;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const TokenSelectWrapper = styled.div`
  flex-shrink: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (min-width: 480px) {
    width: 160px;
  }
`;

const UsdValue = styled.div`
  font-size: 13px;
  color: #8b8fa8;
  font-variant-numeric: tabular-nums;
`;

const ErrorMessage = styled.span`
  font-size: 12px;
  color: #e53e3e;
  margin-top: 2px;
`;
