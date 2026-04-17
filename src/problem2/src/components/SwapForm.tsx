import { useState, useCallback } from 'react';
import type { Token } from '../types';
import { SwapInputGroup } from './SwapInputGroup';
import styles from './SwapForm.module.css';

interface Props {
  tokens: Token[];
}

type SwapStatus = 'idle' | 'loading' | 'success' | 'error';

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
      <div className={styles.success}>
        <div className={styles.successIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2>Swap Confirmed!</h2>
        <p>
          You swapped <strong>{fromAmount} {fromToken?.currency}</strong> for{' '}
          <strong>{toAmount} {toToken?.currency}</strong>
        </p>
        <button className={styles.resetBtn} onClick={handleReset}>
          New Swap
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.header}>
        <h1 className={styles.title}>Swap</h1>
        {exchangeRate && fromToken && toToken && (
          <span className={styles.rate}>
            1 {fromToken.currency} ≈ {exchangeRate.toFixed(6)} {toToken.currency}
          </span>
        )}
      </div>

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


      {/* swap direction button */}
      <div className={styles.swapBtnRow}>
        <button
          type="button"
          className={styles.swapDirectionBtn}
          onClick={handleSwapTokens}
          aria-label="Swap direction"
          title="Swap direction"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </button>
      </div>

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

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <span className={styles.spinner} aria-label="Loading" />
        ) : (
          'Confirm Swap'
        )}
      </button>
    </form>
  );
}
