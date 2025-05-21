import React from 'react';
import PreHarvestingCard from './PreHarvestingCard';
import AfterHarvestingCard from './AfterHarvestingCard';
import HoldingsTable from './HoldingsTable';
import DisclosurePanel from './DisclosurePanel';
import { useTaxLossHarvesting } from '../context/TaxLossHarvestingContext';

const Dashboard: React.FC = () => {
  const { state } = useTaxLossHarvesting();
  const { capitalGains, holdings } = state;

  if (capitalGains.isLoading || holdings.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Loading tax data...</p>
        </div>
      </div>
    );
  }

  if (capitalGains.error || holdings.error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
        <p className="text-red-700 mb-4">
          {capitalGains.error || holdings.error}
        </p>
        <button 
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <DisclosurePanel />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PreHarvestingCard />
        <AfterHarvestingCard />
      </div>
      
      <HoldingsTable />
    </div>
  );
};

export default Dashboard;