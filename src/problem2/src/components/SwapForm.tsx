/** @jsxImportSource @emotion/react */
import { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import type { Token } from '../types';
import { SwapInputGroup } from './SwapInputGroup';

interface Props {
  tokens: Token[];
}

type SwapStatus = 'idle' | 'loading' | 'success' | 'error';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Styled Components
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 4px;
  flex-wrap: wrap;
  gap: 8px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
  letter-spacing: -0.5px;
`;

const Rate = styled.span`
  font-size: 12px;
  color: #8b8fa8;
  font-variant-numeric: tabular-nums;
`;

const SwapButtonRow = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 10;
  margin: -4px 0;
`;

const SwapDirectionButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #e4e6f0;
  background: #ffffff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b8fa8;
  transition: border-color 0.15s, color 0.15s, transform 0.2s;

  &:hover {
    border-color: #6c47ff;
    color: #6c47ff;
    transform: rotate(180deg);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.25);
  }
`;

const SwapIcon = styled.svg`
  width: 18px;
  height: 18px;
`;

const SubmitButton = styled.button`
  margin-top: 8px;
  padding: 16px;
  background: #6c47ff;
  color: #ffffff;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 54px;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.25);
  }
`;

const Spinner = styled.span`
  width: 22px;
  height: 22px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

// Success State Styles
const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 0;
  text-align: center;
  animation: ${fadeIn} 0.3s ease;
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(56, 161, 105, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #38a169;

  svg {
    width: 32px;
    height: 32px;
  }
`;

const SuccessTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
`;

const SuccessText = styled.p`
  font-size: 15px;
  color: #8b8fa8;
  margin: 0;
`;

const ResetButton = styled.button`
  margin-top: 8px;
  padding: 12px 32px;
  background: #6c47ff;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover {
    opacity: 0.9;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.25);
  }
`;

export function SwapForm({ tokens }: Props) {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [status, setStatus] = useState<SwapStatus>('idle');
  const [errors, setErrors] = useState<{ fromAmount?: string; fromToken?: string; toToken?: string }>({});

  // computed exchange rate and output amount
  const exchangeRate =
    fromToken && toToken ? fromToken.price / toToken.price : null;

  const toAmount =
    exchangeRate && fromAmount && !isNaN(Number(fromAmount))
      ? (Number(fromAmount) * exchangeRate).toFixed(6)
      : '';

  function validate() {
    const errs: typeof errors = {};
    if (!fromToken) errs.fromToken = 'Select a token to send';
    if (!toToken) errs.toToken = 'Select a token to receive';
    
    const amountNum = Number(fromAmount);
    if (!fromAmount || isNaN(amountNum)) {
      errs.fromAmount = 'Enter a valid number';
    } else if (amountNum <= 0) {
      errs.fromAmount = 'Amount must be greater than 0';
    }
    
    return errs;
  }

  const handleSwapTokens = useCallback(() => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
  }, [fromToken, toToken, toAmount]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus('loading');

    // simulate backend call
    await new Promise((r) => setTimeout(r, 1800));
    setStatus('success');
  }

  function handleReset() {
    setFromToken(null);
    setToToken(null);
    setFromAmount('');
    setErrors({});
    setStatus('idle');
  }

  const fromUsdValue = fromToken && fromAmount
    ? `≈ $${(Number(fromAmount) * fromToken.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
    : undefined;

  const toUsdValue = toToken && toAmount
    ? `≈ $${(Number(toAmount) * toToken.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
    : undefined;

  if (status === 'success') {
    return (
      <SuccessContainer>
        <SuccessIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </SuccessIcon>
        <SuccessTitle>Swap Confirmed!</SuccessTitle>
        <SuccessText>
          You swapped <strong>{fromAmount} {fromToken?.currency}</strong> for{' '}
          <strong>{toAmount} {toToken?.currency}</strong>
        </SuccessText>
        <ResetButton onClick={handleReset}>
          New Swap
        </ResetButton>
      </SuccessContainer>
    );
  }

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Header>
        <Title>Swap</Title>
        {exchangeRate && fromToken && toToken && (
          <Rate>
            1 {fromToken.currency} ≈ {exchangeRate.toFixed(6)} {toToken.currency}
          </Rate>
        )}
      </Header>

      <SwapInputGroup
        id="from-amount"
        label="You send"
        amount={fromAmount}
        onAmountChange={(value) => {
          setFromAmount(value);
          if (errors.fromAmount) setErrors((p) => ({ ...p, fromAmount: undefined }));
        }}
        token={fromToken}
        onTokenChange={(t) => {
          setFromToken(t);
          if (errors.fromToken) setErrors((p) => ({ ...p, fromToken: undefined }));
        }}
        tokens={tokens}
        error={errors.fromAmount}
        usdValue={fromUsdValue}
      />

      <SwapButtonRow>
        <SwapDirectionButton
          type="button"
          onClick={handleSwapTokens}
          aria-label="Swap direction"
          title="Swap direction"
        >
          <SwapIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </SwapIcon>
        </SwapDirectionButton>
      </SwapButtonRow>

      <SwapInputGroup
        id="to-amount"
        label="You receive"
        amount={toAmount}
        token={toToken}
        onTokenChange={(t) => {
          setToToken(t);
          if (errors.toToken) setErrors((p) => ({ ...p, toToken: undefined }));
        }}
        tokens={tokens}
        error={errors.toToken}
        readOnly
        usdValue={toUsdValue}
      />

      <SubmitButton
        type="submit"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <Spinner aria-label="Loading" />
        ) : (
          'Confirm Swap'
        )}
      </SubmitButton>
    </Form>
  );
}
