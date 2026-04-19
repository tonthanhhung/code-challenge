/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useTokenPrices } from './hooks/useTokenPrices';
import { SwapForm } from './components/SwapForm';

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

function App() {
  const { tokens, loading, error } = useTokenPrices();

  return (
    <AppBg>
      <Card>
        {loading && (
          <CardLoading>
            <Spinner />
            <span>Loading tokens…</span>
          </CardLoading>
        )}
        {error && (
          <CardError>
            Failed to load token prices: {error}
          </CardError>
        )}
        {!loading && !error && <SwapForm tokens={tokens} />}
      </Card>
    </AppBg>
  );
}

export default App;
