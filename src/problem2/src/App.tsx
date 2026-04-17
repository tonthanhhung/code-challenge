import { useTokenPrices } from './hooks/useTokenPrices';
import { SwapForm } from './components/SwapForm';

function App() {
  const { tokens, loading, error } = useTokenPrices();

  return (
    <div className="w-full flex items-center justify-center">
      <div className="bg-white rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 md:p-7 w-full max-w-full sm:max-w-[440px] shadow-[0_20px_60px_rgba(108,71,255,0.12),0_4px_16px_rgba(0,0,0,0.06)] border-[1.5px] border-[#e4e6f0] mx-auto">
        {loading && (
          <div className="flex items-center justify-center gap-3 py-12 text-[#8b8fa8] text-[15px]">
            <span className="w-5 h-5 border-[2.5px] border-[#e4e6f0] border-t-[#6c47ff] rounded-full animate-spin shrink-0" />
            <span>Loading tokens…</span>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center gap-3 py-12 text-error text-[15px]">
            Failed to load token prices: {error}
          </div>
        )}
        {!loading && !error && <SwapForm tokens={tokens} />}
      </div>
    </div>
  );
}

export default App;
