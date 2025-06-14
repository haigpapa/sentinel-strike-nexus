
import React from 'react';

interface RadioGroupProps {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ id, label, options, value, onChange }) => {
  return (
    <div className="flex flex-col space-y-3 p-4">
      <label className="text-sm font-medium text-slate text-center">
        {label}
      </label>
      
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative">
              <input
                type="radio"
                name={id}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
              />
              <div
                className={`
                  w-4 h-4 rounded-full border-2 transition-all duration-200
                  ${value === option
                    ? 'border-primary bg-primary'
                    : 'border-[#6c7680]/50 group-hover:border-primary/50'
                  }
                `}
              />
              {value === option && (
                <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary animate-pulse" />
              )}
            </div>
            <span
              className={`
                text-sm transition-colors duration-200
                ${value === option
                  ? 'text-foreground font-medium'
                  : 'text-slate group-hover:text-foreground'
                }
              `}
            >
              {option}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
