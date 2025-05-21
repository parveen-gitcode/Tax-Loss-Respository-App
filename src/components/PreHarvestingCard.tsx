import React from 'react';
import { useTaxLossHarvesting } from '../context/TaxLossHarvestingContext';
import { formatCurrency } from '../utils/format';

const PreHarvestingCard: React.FC = () => {
  const { state, preHarvestingTotal } = useTaxLossHarvesting();
  const { capitalGains } = state;

  const stcgNet = capitalGains.stcg.profits - capitalGains.stcg.losses;
  const ltcgNet = capitalGains.ltcg.profits - capitalGains.ltcg.losses;

  return (
    <div className="pre-harvesting-card rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">Pre Harvesting</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div></div>
        <div className="text-sm font-medium text-center">Short-term</div>
        <div className="text-sm font-medium text-center">Long-term</div>
        
        <div className="font-medium">Profits</div>
        <div className="text-right">{formatCurrency(capitalGains.stcg.profits)}</div>
        <div className="text-right">{formatCurrency(capitalGains.ltcg.profits)}</div>
        
        <div className="font-medium">Losses</div>
        <div className="text-right">{formatCurrency(capitalGains.stcg.losses)}</div>
        <div className="text-right">{formatCurrency(capitalGains.ltcg.losses)}</div>
        
        <div className="font-medium">Net Capital Gains</div>
        <div className={`text-right ${stcgNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {formatCurrency(stcgNet)}
        </div>
        <div className={`text-right ${ltcgNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {formatCurrency(ltcgNet)}
        </div>
      </div>
      
      <div className="border-t border-gray-700 pt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Realised Capital Gains:</h3>
          <span className={`text-lg font-bold ${preHarvestingTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(preHarvestingTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PreHarvestingCard;