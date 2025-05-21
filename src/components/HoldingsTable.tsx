import React, { useState } from 'react';
import { useTaxLossHarvesting } from '../context/TaxLossHarvestingContext';
import { formatCurrency, formatNumber } from '../utils/format';
import { HoldingType } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

const HoldingsTable: React.FC = () => {
  const { 
    state, 
    toggleHoldingSelection, 
    toggleAllHoldings, 
    isAllSelected, 
    areAnySelected 
  } = useTaxLossHarvesting();
  
  const [showAll, setShowAll] = useState(false);
  const [sortField, setSortField] = useState<keyof HoldingType | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const holdings = state.holdings.holdings;
  const displayedHoldings = showAll ? holdings : holdings.slice(0, 10);

  const handleSort = (field: keyof HoldingType) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (field: keyof HoldingType) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  const sortedHoldings = [...displayedHoldings].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue: any;
    let bValue: any;
    
    if (sortField === 'stcg' || sortField === 'ltcg') {
      aValue = a[sortField].gain;
      bValue = b[sortField].gain;
    } else {
      aValue = a[sortField];
      bValue = b[sortField];
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">Holdings</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="holdings-table w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => toggleAllHoldings(e.target.checked)}
                  className="rounded border-gray-300"
                />
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort('coin')}
              >
                <div className="flex items-center space-x-1">
                  <span>Asset</span>
                  {getSortIcon('coin')}
                </div>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort('totalHolding')}
              >
                <div className="flex items-center space-x-1">
                  <span>Holdings</span>
                  {getSortIcon('totalHolding')}
                </div>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort('currentPrice')}
              >
                <div className="flex items-center space-x-1">
                  <span>Current Price</span>
                  {getSortIcon('currentPrice')}
                </div>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort('stcg')}
              >
                <div className="flex items-center space-x-1">
                  <span>Short-Term Gain</span>
                  {getSortIcon('stcg')}
                </div>
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort('ltcg')}
              >
                <div className="flex items-center space-x-1">
                  <span>Long-Term Gain</span>
                  {getSortIcon('ltcg')}
                </div>
              </th>
              <th>Amount to Sell</th>
            </tr>
          </thead>
          <tbody>
            {sortedHoldings.map((holding) => (
              <tr 
                key={holding.coin}
                className={holding.selected ? 'bg-blue-50' : undefined}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={holding.selected || false}
                    onChange={() => toggleHoldingSelection(holding.coin)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td>
                  <div className="flex items-center space-x-3">
                    <img
                      src={holding.logo}
                      alt={holding.coin}
                      className="w-8 h-8 rounded-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://koinx-statics.s3.ap-south-1.amazonaws.com/currencies/DefaultCoin.svg';
                      }}
                    />
                    <div>
                      <div className="font-medium">{holding.coin}</div>
                      <div className="text-xs text-gray-500">{holding.coinName}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col">
                    <span>{formatNumber(holding.totalHolding)} {holding.coin}</span>
                    <span className="text-xs text-gray-500">Avg. {formatCurrency(holding.averageBuyPrice)}</span>
                  </div>
                </td>
                <td>{formatCurrency(holding.currentPrice)}</td>
                <td>
                  <div className="flex flex-col">
                    <span 
                      className={holding.stcg.gain >= 0 ? 'text-green-600' : 'text-red-600'}
                    >
                      {formatCurrency(holding.stcg.gain)}
                    </span>
                    <span className="text-xs text-gray-500">{formatNumber(holding.stcg.balance)} {holding.coin}</span>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col">
                    <span 
                      className={holding.ltcg.gain >= 0 ? 'text-green-600' : 'text-red-600'}
                    >
                      {formatCurrency(holding.ltcg.gain)}
                    </span>
                    <span className="text-xs text-gray-500">{formatNumber(holding.ltcg.balance)} {holding.coin}</span>
                  </div>
                </td>
                <td>
                  {holding.selected ? (
                    formatNumber(holding.totalHolding) + ' ' + holding.coin
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
            {holdings.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No holdings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {holdings.length > 10 && (
        <div className="p-4 border-t border-gray-200 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {showAll ? 'Show Less' : `View All (${holdings.length})`}
          </button>
        </div>
      )}
      
      {areAnySelected && (
        <div className="p-4 bg-blue-50 border-t border-blue-100 flex justify-between items-center">
          <span className="font-medium text-blue-900">
            {state.holdings.holdings.filter(h => h.selected).length} assets selected
          </span>
          <button
            onClick={() => toggleAllHoldings(false)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default HoldingsTable;