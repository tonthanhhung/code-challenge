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
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filtered = tokens.filter((t) =>
    t.currency.toLowerCase().includes(search.toLowerCase())
  );

  // Close on outside click (desktop) or escape key
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!isMobile && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobile]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobile, open]);

  function handleSelect(token: Token) {
    onChange(token);
    setOpen(false);
    setSearch('');
  }

  function handleClose() {
    setOpen(false);
    setSearch('');
  }

  return (
    <div className="relative flex flex-col gap-1.5 flex-1" ref={ref}>
      <span className="text-[11px] font-semibold tracking-wider uppercase text-[#8b8fa8]">{label}</span>
      <button
        type="button"
        className="flex items-center gap-2.5 px-3.5 py-3 bg-[#f7f8ff] border-[1.5px] border-[#e4e6f0] rounded-xl cursor-pointer text-[15px] font-semibold transition-colors hover:border-[#6c47ff] focus:outline-none focus:border-[#6c47ff] w-full text-left"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value ? (
          <>
            <TokenIcon currency={value.currency} iconUrl={value.iconUrl} />
            <span className="flex-1 text-[#1a1a2e]">{value.currency}</span>
          </>
        ) : (
          <span className="flex-1 text-[#8b8fa8] font-normal">Select token</span>
        )}
        <svg 
          className={`w-4 h-4 text-[#8b8fa8] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Mobile: Bottom Sheet / Drawer */}
      {isMobile && open && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 z-[100]"
            style={{ animation: 'fadeIn 0.2s ease' }}
            onClick={handleClose}
          />
          {/* Drawer */}
          <div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[20px] shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-[101] overflow-hidden"
            style={{ animation: 'slideUp 0.3s ease' }}
            role="listbox"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#e4e6f0] rounded-full" />
            </div>
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#e4e6f0]">
              <span className="text-[17px] font-bold text-[#1a1a2e]">Select Token</span>
              <button 
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center text-[#8b8fa8] hover:text-[#1a1a2e] transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {/* Search */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#e4e6f0] bg-[#f7f8ff]">
              <svg
                className="w-5 h-5 text-[#8b8fa8] shrink-0"
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
                className="flex-1 border-0 bg-transparent text-base text-[#1a1a2e] outline-none placeholder:text-[#8b8fa8]"
                placeholder="Search tokens..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Token List */}
            <ul className="list-none m-0 p-2 max-h-[60vh] overflow-y-auto pb-8">
              {filtered.length === 0 && (
                <li className="px-4 py-8 text-center text-[#8b8fa8] text-sm">No tokens found</li>
              )}
              {filtered.map((token) => (
                <li
                  key={token.currency}
                  role="option"
                  aria-selected={value?.currency === token.currency}
                  className={`flex items-center gap-3 px-4 py-4 rounded-xl cursor-pointer transition-colors active:scale-[0.98] ${value?.currency === token.currency ? 'bg-[rgba(108,71,255,0.1)]' : 'hover:bg-[#f0f2ff]'}`}
                  onClick={() => handleSelect(token)}
                >
                  <TokenIcon currency={token.currency} iconUrl={token.iconUrl} />
                  <div className="flex-1 flex flex-col">
                    <span className="text-base font-bold text-[#1a1a2e]">{token.currency}</span>
                    <span className="text-sm text-[#8b8fa8]">${token.price.toFixed(4)}</span>
                  </div>
                  {value?.currency === token.currency && (
                    <svg className="w-5 h-5 text-[#6c47ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Desktop: Dropdown */}
      {!isMobile && open && (
        <div
          className="absolute top-[calc(100%+6px)] left-0 right-0 min-w-[260px] max-w-screen bg-white border-[1.5px] border-[#e4e6f0] rounded-[14px] shadow-[0_20px_60px_rgba(108,71,255,0.12),0_4px_16px_rgba(0,0,0,0.06)] z-[100] overflow-hidden"
          style={{ animation: 'dropIn 0.15s ease' }}
          role="listbox"
        >
          <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-[#e4e6f0]">
            <svg
              className="w-4 h-4 text-[#8b8fa8] shrink-0"
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
              className="flex-1 border-0 bg-transparent text-sm text-[#1a1a2e] outline-none placeholder:text-[#8b8fa8]"
              placeholder="Search token..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <ul className="list-none m-0 p-1.5 max-h-60 overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-4 py-4 text-center text-[#8b8fa8] text-sm">No tokens found</li>
            )}
            {filtered.map((token) => (
              <li
                key={token.currency}
                role="option"
                aria-selected={value?.currency === token.currency}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[#f0f2ff] ${value?.currency === token.currency ? 'bg-[rgba(108,71,255,0.1)]' : ''}`}
                onClick={() => handleSelect(token)}
              >
                <TokenIcon currency={token.currency} iconUrl={token.iconUrl} />
                <span className="flex-1 text-sm font-semibold text-[#1a1a2e]">{token.currency}</span>
                <span className="text-xs text-[#8b8fa8] tabular-nums">${token.price.toFixed(4)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function TokenIcon({ currency, iconUrl }: { currency: string; iconUrl: string }) {
  const [errored, setErrored] = useState(false);
  return errored ? (
    <span className="w-6 h-6 rounded-full bg-[rgba(108,71,255,0.1)] text-[#6c47ff] text-[10px] font-bold flex items-center justify-center shrink-0">
      {currency.slice(0, 2)}
    </span>
  ) : (
    <img
      className="w-6 h-6 rounded-full object-contain bg-[#f0f2ff] shrink-0"
      src={iconUrl}
      alt={currency}
      onError={() => setErrored(true)}
    />
  );
}
