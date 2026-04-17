import { useState, useRef, useEffect } from 'react';
import type { Token } from '../types';

interface Props {
  tokens: Token[];
  value: Token | null;
  onChange: (token: Token) => void;
  label: string;
}

export function TokenSelect({ tokens, value, onChange, label }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const filtered = tokens.filter((t) =>
    t.currency.toLowerCase().includes(search.toLowerCase())
  );

  // close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(token: Token) {
    onChange(token);
    setOpen(false);
    setSearch('');
  }

  return (
    <div className="relative flex flex-col gap-1.5 flex-1" ref={ref}>
      <span className="text-xs font-semibold tracking-wider uppercase text-text-muted">{label}</span>
      <button
        type="button"
        className="flex items-center gap-2.5 px-3.5 py-3 bg-input border-[1.5px] border-border rounded-xl cursor-pointer text-[15px] font-semibold text-text transition-colors hover:border-accent focus:outline-none focus:border-accent focus:ring-[3px] focus:ring-accent/25 w-full text-left"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value ? (
          <>
            <TokenIcon currency={value.currency} iconUrl={value.iconUrl} />
            <span className="flex-1">{value.currency}</span>
          </>
        ) : (
          <span className="text-text-muted font-normal">Select token</span>
        )}
        <svg
          className={`w-4 h-4 text-text-muted shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-[calc(100%+6px)] left-0 right-0 min-w-[260px] max-w-screen bg-card border-[1.5px] border-border rounded-[14px] shadow-lg z-[100] overflow-hidden animate-[dropIn_0.15s_ease]"
          role="listbox"
        >
          <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-border">
            <svg
              className="w-4 h-4 text-text-muted shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              autoFocus
              className="flex-1 border-0 bg-transparent text-sm text-text outline-none placeholder:text-text-muted"
              placeholder="Search token…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ul className="list-none m-0 p-1.5 max-h-60 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-4 py-4 text-center text-text-muted text-sm">No tokens found</li>
            )}
            {filtered.map((token) => (
              <li
                key={token.currency}
                role="option"
                aria-selected={value?.currency === token.currency}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors hover:bg-hover ${value?.currency === token.currency ? 'bg-accent-subtle' : ''}`}
                onClick={() => handleSelect(token)}
              >
                <TokenIcon currency={token.currency} iconUrl={token.iconUrl} />
                <span className="flex-1 text-sm font-semibold text-text">{token.currency}</span>
                <span className="text-xs text-text-muted tabular-nums">${token.price.toFixed(4)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function TokenIcon({ currency, iconUrl }: { currency: string; iconUrl: string }) {
  const [errored, setErrored] = useState(false);
  return errored ? (
    <span className="w-6 h-6 rounded-full bg-accent-subtle text-accent text-[10px] font-bold flex items-center justify-center shrink-0">
      {currency.slice(0, 2)}
    </span>
  ) : (
    <img
      className="w-6 h-6 rounded-full object-contain bg-icon shrink-0"
      src={iconUrl}
      alt={currency}
      onError={() => setErrored(true)}
    />
  );
}
