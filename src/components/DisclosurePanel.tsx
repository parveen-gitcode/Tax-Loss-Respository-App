import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const DisclosurePanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-900 text-white rounded-lg shadow-md overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center"
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg font-semibold">Important Notes And Disclaimers</span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      
      {isOpen && (
        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Tax loss harvesting involves selling investments at a loss to offset capital gains tax liability.
            </li>
            <li>
              This tool is for informational purposes only and does not constitute tax, legal, or financial advice.
            </li>
            <li>
              The calculations are estimates based on the provided data and may not reflect your actual tax situation.
            </li>
            <li>
              Consult with a qualified tax professional before making investment decisions based on tax considerations.
            </li>
            <li>
              Be aware of wash sale rules, which may disallow losses if substantially identical securities are purchased within 30 days before or after selling at a loss.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DisclosurePanel;