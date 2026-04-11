/**
 * Problem 3: Messy React
 *
 * Below is the original code then a fully refactored version.
 */

// ORIGINAL CODE

/*
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case 'Osmosis':  return 100
      case 'Ethereum': return 50
      case 'Arbitrum': return 30
      case 'Zilliqa':  return 20
      case 'Neo':      return 20
      default:         return -99
    }
  }

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (lhsPriority > -99) {           // BUG: lhsPriority is undefined
        if (balance.amount <= 0) {       // BUG: filter logic is inverted
          return true;
        }
      }
      return false
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority  = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
      // BUG: missing return 0 for equal priorities — sort is non-deterministic
    });
  }, [balances, prices]);               // BUG: prices in deps but not used inside

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    // BUG: uses sortedBalances (WalletBalance[]) not formattedBalances,
    //        so balance.formatted is always undefined at runtime
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}                      // BUG: index as key — unstable on reorder
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}
*/


// REFACTORED VERSION

import React, {useMemo} from 'react';


type Blockchain = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain; // FIX Issue: added typed field
}

interface Props {
  className?: string;
  children?: React.ReactNode;
}


// FIX Issue: moved outside component so it is never recreated
// FIX Issue: typed parameter instead of `any`
const BLOCKCHAIN_PRIORITY: Record<Blockchain, number> = {
  Osmosis:  100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa:  20,
  Neo:      20,
};

function getPriority(blockchain: Blockchain): number {
  return BLOCKCHAIN_PRIORITY[blockchain] ?? -99;
}

// stubs for hooks/components that would be provided by the app
declare function useWalletBalances(): WalletBalance[];
declare function usePrices(): Record<string, number>;
declare function WalletRow(props: {
  className?: string,
  amount: number,
  usdValue: number,
  formattedAmount: string,
  key?: string
}): React.ReactElement;
declare const classes: { row: string };

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices   = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance) => {
        const priority = getPriority(balance.blockchain);
        // FIX Issue: use the correct variable
        // FIX Issue: keep balances with a known blockchain AND positive amount
        return priority > -99 && balance.amount > 0;
      })
      .sort((lhs, rhs) => {
        // FIX Issue: always return a number (0 for equal priorities)
        // negative → lhs first, positive → rhs first, 0 → stable
        return getPriority(rhs.blockchain) - getPriority(lhs.blockchain);
      });
    // FIX Issue: removed `prices` from deps — it is not used here
  }, [balances]);

  // FIX Issue: single pass — format and build rows together
  const rows = sortedBalances.map((balance) => {
    const formatted = balance.amount.toFixed(2);
    const usdValue  = (prices[balance.currency] ?? 0) * balance.amount;

    return (
      <WalletRow
        className={classes.row}
        // FIX Issue: stable, unique key
        key={balance.currency}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={formatted}
      />
    );
  });

  return (
    // FIX Issue: render children so they are not silently dropped
    <div {...rest}>
      {rows}
      {children}
    </div>
  );
};

export default WalletPage;
