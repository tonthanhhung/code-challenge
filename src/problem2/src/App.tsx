/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useTokenPrices } from './hooks/useTokenPrices';
import { SwapForm } from './components/SwapForm';

function App() {
  const { tokens, loading, error } = useTokenPrices();
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
    setCurrentLang(newLang);
  };

  return (
    <AppBg>
      <Card>
        <Header>
          <Title>{t('app.title')}</Title>
          <LanguageSwitcher onClick={toggleLanguage}>
            {currentLang === 'en' ? '🇺🇸 EN' : '🇻🇳 VI'}
          </LanguageSwitcher>
        </Header>
        
        {loading && (
          <CardLoading>
            <Spinner />
            <span>{t('app.loading')}</span>
          </CardLoading>
        )}
        {error && (
          <CardError>
            {t('app.error')}: {error}
          </CardError>
        )}
        {!loading && !error && <SwapForm tokens={tokens} />}
      </Card>
    </AppBg>
  );
}

// Styled Components
const AppBg = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 16px;
  width: 100%;
  max-width: 100%;
  box-shadow: 0 20px 60px rgba(108, 71, 255, 0.12), 0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1.5px solid #e4e6f0;
  margin: 0 auto;

  @media (min-width: 360px) {
    max-width: 440px;
    padding: 20px;
    border-radius: 24px;
  }

  @media (min-width: 480px) {
    padding: 28px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
`;

const LanguageSwitcher = styled.button`
  padding: 8px 12px;
  background: #f7f8ff;
  border: 1.5px solid #e4e6f0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a2e;
  transition: all 0.15s;

  &:hover {
    border-color: #6c47ff;
    background: rgba(108, 71, 255, 0.05);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(108, 71, 255, 0.25);
  }
`;

const CardLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 0;
  color: #8b8fa8;
  font-size: 15px;
`;

const CardError = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 0;
  color: #e53e3e;
  font-size: 15px;
`;

const Spinner = styled.span`
  width: 20px;
  height: 20px;
  border: 2.5px solid #e4e6f0;
  border-top-color: #6c47ff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default App;
