import React from 'react';
import { TaxLossHarvestingProvider } from './context/TaxLossHarvestingContext';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <div className="app min-h-screen bg-gray-100 text-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Tax Loss Harvesting</h1>
        <TaxLossHarvestingProvider>
          <Dashboard />
        </TaxLossHarvestingProvider>
      </div>
    </div>
  );
}

export default App;