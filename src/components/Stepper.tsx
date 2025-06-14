
import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface StepperProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ id, label, value, min, max, step, onChange }) => {
  const handleIncrement = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  return (
    <div className="flex flex-col items-center space-y-3 p-4">
      <label htmlFor={id} className="text-sm font-medium text-slate text-center">
        {label}
      </label>
      
      <div className="flex flex-col items-center space-y-2">
        <button
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-8 h-8 bg-[#1a1f25] border border-[#6c7680]/30 rounded-md flex items-center justify-center hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 text-primary" />
        </button>
        
        <div className="w-16 h-12 bg-[#1a1f25] border border-[#6c7680]/30 rounded-md flex items-center justify-center">
          <span className="text-lg font-bold text-foreground">{value}</span>
        </div>
        
        <button
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-8 h-8 bg-[#1a1f25] border border-[#6c7680]/30 rounded-md flex items-center justify-center hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default Stepper;
