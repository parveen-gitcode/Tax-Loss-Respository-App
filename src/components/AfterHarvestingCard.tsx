import React from 'react';
import { useTaxLossHarvesting } from '../context/TaxLossHarvestingContext';
import { formatCurrency } from '../utils/format';

const AfterHarvestingCard: React.FC = () => {
  const { state, afterHarvestingTotal, savings } = useTaxLossHarvesting();
  const { afterHarvesting } = state;

  const stcgNet = afterHarvesting.stcg.profits - afterHarvesting.stcg.losses;
  const ltcgNet = afterHarvesting.ltcg.profits - afterHarvesting.ltcg.losses;

  return (
    <div className="after-harvesting-card rounded-lg p-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">After Harvesting</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div></div>
        <div className="text-sm font-medium text-center">Short-term</div>
        <div className="text-sm font-medium text-center">Long-term</div>
        
        <div className="font-medium">Profits</div>
        <div className="text-right">{formatCurrency(afterHarvesting.stcg.profits)}</div>
        <div className="text-right">{formatCurrency(afterHarvesting.ltcg.profits)}</div>
        
        <div className="font-medium">Losses</div>
        <div className="text-right">{formatCurrency(afterHarvesting.stcg.losses)}</div>
        <div className="text-right">{formatCurrency(afterHarvesting.ltcg.losses)}</div>
        
        <div className="font-medium">Net Capital Gains</div>
        <div className={`text-right ${stcgNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {formatCurrency(stcgNet)}
        </div>
        <div className={`text-right ${ltcgNet >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {formatCurrency(ltcgNet)}
        </div>
      </div>
      
      <div className="border-t border-blue-400 pt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">Effective Capital Gains:</h3>
          <span className={`text-lg font-bold ${afterHarvestingTotal >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(afterHarvestingTotal)}
          </span>
        </div>
        
        {savings > 0 && (
          <div className="mt-4 bg-green-900 bg-opacity-30 p-3 rounded-md text-green-300 font-medium text-center">
            You're going to save {formatCurrency(savings)}
          </div>
        )}
      </div>
    </div>
  );
};

export default AfterHarvestingCard;