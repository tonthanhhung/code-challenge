/** @jsxImportSource @emotion/react */
import { useState, useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import type { Token } from '../types';

interface Props {
  tokens: Token[];
  value: Token | null;
  onChange: (token: Token) => void;
  label: string;
}

export function TokenSelect({ tokens, value, onChange, label }: Props) {
  const { t } = useTranslation();
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
    <Wrapper ref={ref}>
      <LabelText>{label}</LabelText>
      <Trigger
        type="button"
        isOpen={open}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value ? (
          <>
            <TokenIcon currency={value.currency} iconUrl={value.iconUrl} />
            <SelectedText>{value.currency}</SelectedText>
          </>
        ) : (
          <PlaceholderText>{t('swap.selectToken')}</PlaceholderText>
        )}
        <Chevron
          isOpen={open}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </Chevron>
      </Trigger>

      {/* Mobile: Bottom Sheet / Drawer */}
      {isMobile && open && (
        <>
          <Backdrop onClick={handleClose} />
          <Drawer role="listbox">
            <HandleBar>
              <Handle />
            </HandleBar>
            <DrawerHeader>
              <DrawerTitle>{t('swap.selectToken')}</DrawerTitle>
              <CloseButton onClick={handleClose} aria-label={t('swap.close')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </CloseButton>
            </DrawerHeader>
            <DrawerSearchWrapper>
              <DrawerSearchIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </DrawerSearchIcon>
              <DrawerSearchInput
                autoFocus
                placeholder={t('swap.searchTokens')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </DrawerSearchWrapper>
            <DrawerTokenList>
              {filtered.length === 0 && (
                <DrawerEmptyMessage>{t('swap.noTokensFound')}</DrawerEmptyMessage>
              )}
              {filtered.map((token) => (
                <DrawerTokenItem
                  key={token.currency}
                  role="option"
                  aria-selected={value?.currency === token.currency}
                  isSelected={value?.currency === token.currency}
                  onClick={() => handleSelect(token)}
                >
                  <TokenIcon currency={token.currency} iconUrl={token.iconUrl} size="large" />
                  <TokenInfo>
                    <TokenName>{token.currency}</TokenName>
                    <TokenPriceLarge>${token.price.toFixed(4)}</TokenPriceLarge>
                  </TokenInfo>
                  {value?.currency === token.currency && (
                    <Checkmark viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </Checkmark>
                  )}
                </DrawerTokenItem>
              ))}
            </DrawerTokenList>
          </Drawer>
        </>
      )}

      {/* Desktop: Dropdown */}
      {!isMobile && open && (
        <Dropdown role="listbox">
          <SearchWrapper>
            <SearchIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </SearchIcon>
            <SearchInput
              autoFocus
              placeholder={t('swap.searchTokens')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </SearchWrapper>
          <TokenList>
            {filtered.length === 0 && (
              <EmptyMessage>{t('swap.noTokensFound')}</EmptyMessage>
            )}
            {filtered.map((token) => (
              <TokenItem
                key={token.currency}
                role="option"
                aria-selected={value?.currency === token.currency}
                isSelected={value?.currency === token.currency}
                onClick={() => handleSelect(token)}
              >
                <TokenIcon currency={token.currency} iconUrl={token.iconUrl} />
                <TokenCurrency>{token.currency}</TokenCurrency>
                <TokenPrice>${token.price.toFixed(4)}</TokenPrice>
              </TokenItem>
            ))}
          </TokenList>
        </Dropdown>
      )}
    </Wrapper>
  );
}

function TokenIcon({ currency, iconUrl, size = 'small' }: { currency: string; iconUrl: string; size?: 'small' | 'large' }) {
  const [errored, setErrored] = useState(false);
  
  if (errored) {
    if (size === 'large') {
      return <DrawerIconFallback>{currency.slice(0, 2)}</DrawerIconFallback>;
    }
    return <IconFallback>{currency.slice(0, 2)}</IconFallback>;
  }
  
  if (size === 'large') {
    return (
      <DrawerIcon
        src={iconUrl}
        alt={currency}
        onError={() => setErrored(true)}
      />
    );
  }
  
  return (
    <Icon
      src={iconUrl}
      alt={currency}
      onError={() => setErrored(true)}
    />
  );
}

// Animations
const dropIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// Styled Components
const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const LabelText = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8b8fa8;
`;

const Trigger = styled.button<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: #f7f8ff;
  border: 1.5px solid #e4e6f0;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;
  text-align: left;
  outline: none;

  &:hover {
    border-color: #6c47ff;
  }

  &:focus-visible {
    border-color: #6c47ff;
    box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.25);
  }

  ${props => props.isOpen && `
    border-color: #6c47ff;
  `}
`;

const SelectedText = styled.span`
  flex: 1;
  color: #1a1a2e;
`;

const PlaceholderText = styled.span`
  flex: 1;
  color: #8b8fa8;
  font-weight: 400;
`;

const Chevron = styled.svg<{ isOpen: boolean }>`
  width: 16px;
  height: 16px;
  color: #8b8fa8;
  flex-shrink: 0;
  transition: transform 0.2s;
  
  ${props => props.isOpen && `
    transform: rotate(180deg);
  `}
`;

// Desktop Dropdown Styles
const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  min-width: 260px;
  max-width: 100vw;
  background: #ffffff;
  border: 1.5px solid #e4e6f0;
  border-radius: 14px;
  box-shadow: 0 20px 60px rgba(108, 71, 255, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06);
  z-index: 100;
  overflow: hidden;
  animation: ${dropIn} 0.15s ease;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid #e4e6f0;
`;

const SearchIcon = styled.svg`
  width: 16px;
  height: 16px;
  color: #8b8fa8;
  flex-shrink: 0;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #1a1a2e;
  outline: none;

  &::placeholder {
    color: #8b8fa8;
  }
`;

const TokenList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 6px;
  max-height: 240px;
  overflow-y: auto;
`;

const TokenItem = styled.li<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.1s;

  &:hover {
    background: #f0f2ff;
  }

  ${props => props.isSelected && `
    background: rgba(108, 71, 255, 0.1);
  `}
`;

const TokenCurrency = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
`;

const TokenPrice = styled.span`
  font-size: 12px;
  color: #8b8fa8;
  font-variant-numeric: tabular-nums;
`;

const EmptyMessage = styled.li`
  padding: 16px;
  text-align: center;
  color: #8b8fa8;
  font-size: 14px;
`;

// Mobile Drawer Styles
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
  animation: ${fadeIn} 0.2s ease;
`;

const Drawer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.15);
  z-index: 101;
  overflow: hidden;
  animation: ${slideUp} 0.3s ease;
  max-height: 85vh;
`;

const HandleBar = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 12px;
  padding-bottom: 8px;
`;

const Handle = styled.div`
  width: 40px;
  height: 4px;
  background: #e4e6f0;
  border-radius: 2px;
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid #e4e6f0;
`;

const DrawerTitle = styled.span`
  font-size: 17px;
  font-weight: 700;
  color: #1a1a2e;
`;

const CloseButton = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8b8fa8;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s;

  &:hover {
    color: #1a1a2e;
  }
`;

const DrawerSearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #e4e6f0;
  background: #f7f8ff;
`;

const DrawerSearchIcon = styled.svg`
  width: 20px;
  height: 20px;
  color: #8b8fa8;
  flex-shrink: 0;
`;

const DrawerSearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #1a1a2e;
  outline: none;

  &::placeholder {
    color: #8b8fa8;
  }
`;

const DrawerTokenList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 8px;
  max-height: 60vh;
  overflow-y: auto;
  padding-bottom: 32px;
`;

const DrawerTokenItem = styled.li<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.1s, transform 0.1s;

  &:hover {
    background: #f0f2ff;
  }

  &:active {
    transform: scale(0.98);
  }

  ${props => props.isSelected && `
    background: rgba(108, 71, 255, 0.1);
  `}
`;

const TokenInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TokenName = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
`;

const TokenPriceLarge = styled.span`
  font-size: 14px;
  color: #8b8fa8;
`;

const Checkmark = styled.svg`
  width: 20px;
  height: 20px;
  color: #6c47ff;
`;

const DrawerEmptyMessage = styled.li`
  padding: 32px 16px;
  text-align: center;
  color: #8b8fa8;
  font-size: 14px;
`;

// Token Icon Styles
const Icon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: contain;
  background: #f0f2ff;
  flex-shrink: 0;
`;

const IconFallback = styled.span`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(108, 71, 255, 0.1);
  color: #6c47ff;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const DrawerIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: contain;
  background: #f0f2ff;
  flex-shrink: 0;
`;

const DrawerIconFallback = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(108, 71, 255, 0.1);
  color: #6c47ff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;
