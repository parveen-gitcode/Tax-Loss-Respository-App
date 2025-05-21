import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchHoldings, fetchCapitalGains } from '../api/mockApi';
import { HoldingType, TaxLossHarvestingState, CapitalGains } from '../types';

const initialState: TaxLossHarvestingState = {
  capitalGains: {
    stcg: {
      profits: 0,
      losses: 0
    },
    ltcg: {
      profits: 0,
      losses: 0
    },
    isLoading: true,
    error: null
  },
  holdings: {
    holdings: [],
    selectedHoldings: [],
    isLoading: true,
    error: null
  },
  afterHarvesting: {
    stcg: {
      profits: 0,
      losses: 0
    },
    ltcg: {
      profits: 0,
      losses: 0
    }
  }
};

type TaxLossHarvestingContextType = {
  state: TaxLossHarvestingState;
  toggleHoldingSelection: (holdingId: string) => void;
  toggleAllHoldings: (selected: boolean) => void;
  isAllSelected: boolean;
  areAnySelected: boolean;
  savings: number;
  preHarvestingTotal: number;
  afterHarvestingTotal: number;
};

const TaxLossHarvestingContext = createContext<TaxLossHarvestingContextType | undefined>(undefined);

export const TaxLossHarvestingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TaxLossHarvestingState>(initialState);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [areAnySelected, setAreAnySelected] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch capital gains data
        const capitalGainsData = await fetchCapitalGains();
        const holdingsData = await fetchHoldings();
        
        // Update state with fetched data
        setState(prevState => ({
          ...prevState,
          capitalGains: {
            ...capitalGainsData.capitalGains,
            isLoading: false,
            error: null
          },
          holdings: {
            holdings: holdingsData.map(holding => ({ ...holding, selected: false })),
            selectedHoldings: [],
            isLoading: false,
            error: null
          },
          afterHarvesting: { ...capitalGainsData.capitalGains }
        }));
      } catch (error) {
        setState(prevState => ({
          ...prevState,
          capitalGains: {
            ...prevState.capitalGains,
            isLoading: false,
            error: 'Failed to fetch capital gains data'
          },
          holdings: {
            ...prevState.holdings,
            isLoading: false,
            error: 'Failed to fetch holdings data'
          }
        }));
      }
    };

    fetchData();
  }, []);

  // Toggle selection of a holding
  const toggleHoldingSelection = (coinId: string) => {
    setState(prevState => {
      // Update holdings
      const updatedHoldings = prevState.holdings.holdings.map(holding => 
        holding.coin === coinId 
          ? { ...holding, selected: !holding.selected } 
          : holding
      );
      
      // Update selected holdings
      const selectedHoldings = updatedHoldings.filter(holding => holding.selected);
      
      // Calculate new after harvesting values
      const afterHarvesting = calculateAfterHarvesting(
        prevState.capitalGains, 
        selectedHoldings
      );

      return {
        ...prevState,
        holdings: {
          ...prevState.holdings,
          holdings: updatedHoldings,
          selectedHoldings
        },
        afterHarvesting
      };
    });
  };

  // Toggle selection of all holdings
  const toggleAllHoldings = (selected: boolean) => {
    setState(prevState => {
      // Update all holdings' selection state
      const updatedHoldings = prevState.holdings.holdings.map(holding => ({
        ...holding,
        selected
      }));
      
      // Update selected holdings
      const selectedHoldings = selected ? [...updatedHoldings] : [];
      
      // Calculate new after harvesting values
      const afterHarvesting = calculateAfterHarvesting(
        prevState.capitalGains, 
        selectedHoldings
      );

      return {
        ...prevState,
        holdings: {
          ...prevState.holdings,
          holdings: updatedHoldings,
          selectedHoldings
        },
        afterHarvesting
      };
    });
  };

  // Calculate after harvesting values based on selected holdings
  const calculateAfterHarvesting = (
    initialCapitalGains: CapitalGains,
    selectedHoldings: HoldingType[]
  ): CapitalGains => {
    // Start with initial capital gains
    const afterHarvesting = { ...initialCapitalGains };

    // Update with selected holdings' gains
    selectedHoldings.forEach(holding => {
      // Short-term capital gains
      if (holding.stcg.gain > 0) {
        afterHarvesting.stcg.profits += holding.stcg.gain;
      } else if (holding.stcg.gain < 0) {
        afterHarvesting.stcg.losses += Math.abs(holding.stcg.gain);
      }

      // Long-term capital gains
      if (holding.ltcg.gain > 0) {
        afterHarvesting.ltcg.profits += holding.ltcg.gain;
      } else if (holding.ltcg.gain < 0) {
        afterHarvesting.ltcg.losses += Math.abs(holding.ltcg.gain);
      }
    });

    return afterHarvesting;
  };

  // Check if all holdings are selected
  useEffect(() => {
    const allSelected = state.holdings.holdings.length > 0 && 
      state.holdings.holdings.every(holding => holding.selected);
    setIsAllSelected(allSelected);
    
    const anySelected = state.holdings.holdings.some(holding => holding.selected);
    setAreAnySelected(anySelected);
  }, [state.holdings.holdings]);

  // Calculate pre and post harvesting totals
  const preHarvestingTotal = 
    (state.capitalGains.stcg.profits - state.capitalGains.stcg.losses) +
    (state.capitalGains.ltcg.profits - state.capitalGains.ltcg.losses);

  const afterHarvestingTotal = 
    (state.afterHarvesting.stcg.profits - state.afterHarvesting.stcg.losses) +
    (state.afterHarvesting.ltcg.profits - state.afterHarvesting.ltcg.losses);

  // Calculate potential savings
  const savings = preHarvestingTotal > afterHarvestingTotal 
    ? preHarvestingTotal - afterHarvestingTotal 
    : 0;

  const contextValue = {
    state,
    toggleHoldingSelection,
    toggleAllHoldings,
    isAllSelected,
    areAnySelected,
    savings,
    preHarvestingTotal,
    afterHarvestingTotal
  };

  return (
    <TaxLossHarvestingContext.Provider value={contextValue}>
      {children}
    </TaxLossHarvestingContext.Provider>
  );
};

export const useTaxLossHarvesting = () => {
  const context = useContext(TaxLossHarvestingContext);
  if (context === undefined) {
    throw new Error('useTaxLossHarvesting must be used within a TaxLossHarvestingProvider');
  }
  return context;
};