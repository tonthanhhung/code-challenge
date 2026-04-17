import { useState, useCallback } from 'react';
import type { Token } from '../types';
import { SwapInputGroup } from './SwapInputGroup';

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
      <div className="flex flex-col items-center gap-4 px-8 py-8 text-center animate-[fadeIn_0.3s_ease]">
        <div className="w-16 h-16 rounded-full bg-success-bg flex items-center justify-center text-success">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-[22px] font-bold text-text m-0">Swap Confirmed!</h2>
        <p className="text-[15px] text-text-muted m-0">
          You swapped <strong>{fromAmount} {fromToken?.currency}</strong> for{' '}
          <strong>{toAmount} {toToken?.currency}</strong>
        </p>
        <button 
          className="mt-2 px-8 py-3 bg-accent text-white border-0 rounded-xl text-[15px] font-semibold cursor-pointer transition-opacity hover:opacity-90"
          onClick={handleReset}
        >
          New Swap
        </button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit} noValidate>
      <div className="flex items-baseline justify-between mb-1 flex-wrap gap-2">
        <h1 className="text-[22px] font-bold text-text m-0 tracking-tight">Swap</h1>
        {exchangeRate && fromToken && toToken && (
          <span className="text-xs text-text-muted tabular-nums">
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
      <div className="flex justify-center relative z-10 my-[-4px]">
        <button
          type="button"
          className="w-9 h-9 rounded-full border-2 border-border bg-card cursor-pointer flex items-center justify-center text-text-muted transition-all hover:border-accent hover:text-accent hover:rotate-180"
          onClick={handleSwapTokens}
          aria-label="Swap direction"
          title="Swap direction"
        >
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
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
        className="mt-2 px-4 py-4 bg-accent text-white border-0 rounded-xl text-base font-bold cursor-pointer transition-all flex items-center justify-center min-h-[54px] hover:opacity-90 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <span className="w-[22px] h-[22px] border-[3px] border-white/30 border-t-white rounded-full animate-spin" aria-label="Loading" />
        ) : (
          'Confirm Swap'
        )}
      </button>
    </form>
  );
}
