
import React from 'react';

interface ToggleSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, label, checked, onChange }) => {
  return (
    <div className="flex flex-col items-center space-y-2 p-3">
      <label htmlFor={id} className="text-sm font-medium text-slate">
        {label}
      </label>
      
      <div className="relative">
        <button
          id={id}
          onClick={() => onChange(!checked)}
          className={`
            relative w-12 h-20 rounded-full transition-all duration-200 border-2
            ${checked 
              ? 'bg-primary/20 border-primary' 
              : 'bg-[#1a1f25] border-[#6c7680]/30'
            }
          `}
        >
          {/* Toggle button */}
          <div
            className={`
              absolute w-8 h-8 rounded-full transition-all duration-200 left-1
              ${checked 
                ? 'top-1 bg-primary shadow-lg shadow-primary/50' 
                : 'top-9 bg-[#6c7680]'
              }
            `}
          />
          
          {/* LED indicator */}
          <div
            className={`
              absolute w-2 h-2 rounded-full right-1 transition-all duration-200
              ${checked 
                ? 'top-3 bg-primary shadow-sm shadow-primary/80' 
                : 'top-13 bg-[#6c7680]/50'
              }
            `}
          />
        </button>
      </div>
    </div>
  );
};

export default ToggleSwitch;
