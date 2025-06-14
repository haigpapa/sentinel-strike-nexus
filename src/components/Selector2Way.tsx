
import React from 'react';

interface Selector2WayProps {
  id: string;
  label: string;
  options: [string, string];
  value: string;
  onChange: (value: string) => void;
}

const Selector2Way: React.FC<Selector2WayProps> = ({ id, label, options, value, onChange }) => {
  return (
    <div className="flex flex-col items-center space-y-3 p-4">
      <label htmlFor={id} className="text-sm font-medium text-slate text-center">
        {label}
      </label>
      
      <div className="relative bg-[#1a1f25] border border-[#6c7680]/30 rounded-lg p-1 flex">
        {options.map((option, index) => (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`
              relative px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
              ${value === option
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-slate hover:text-foreground hover:bg-[#6c7680]/10'
              }
            `}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Selector2Way;
