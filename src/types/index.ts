export interface CapitalGainType {
  balance: number;
  gain: number;
}

export interface HoldingType {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: CapitalGainType;
  ltcg: CapitalGainType;
  selected?: boolean;
}

export interface CapitalGainsSection {
  profits: number;
  losses: number;
}

export interface CapitalGains {
  stcg: CapitalGainsSection;
  ltcg: CapitalGainsSection;
}

export interface CapitalGainsData {
  capitalGains: CapitalGains;
}

export interface CapitalGainsState extends CapitalGains {
  isLoading: boolean;
  error: string | null;
}

export interface HoldingsState {
  holdings: HoldingType[];
  selectedHoldings: HoldingType[];
  isLoading: boolean;
  error: string | null;
}

export interface TaxLossHarvestingState {
  capitalGains: CapitalGainsState;
  holdings: HoldingsState;
  afterHarvesting: CapitalGains;
}