
import React, { useState, useRef, useCallback } from 'react';

interface RotarySliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
  onPulse?: () => void;
}

const RotarySlider: React.FC<RotarySliderProps> = ({
  id,
  label,
  value,
  min,
  max,
  step,
  unit = '',
  onChange,
  onPulse
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const normalizedValue = (value - min) / (max - min);
  const rotation = normalizedValue * 270 - 135; // -135° to +135°

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let degrees = (angle * 180) / Math.PI + 90;
    
    if (degrees < 0) degrees += 360;
    if (degrees > 315) degrees -= 360;
    
    const clampedDegrees = Math.max(-135, Math.min(135, degrees));
    const normalizedAngle = (clampedDegrees + 135) / 270;
    const newValue = min + normalizedAngle * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    
    if (steppedValue !== value) {
      onChange(Math.max(min, Math.min(max, steppedValue)));
      setShowPulse(true);
      onPulse?.();
      setTimeout(() => setShowPulse(false), 1000);
    }
  }, [isDragging, value, min, max, step, onChange, onPulse]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -step : step;
    const newValue = Math.max(min, Math.min(max, value + delta));
    if (newValue !== value) {
      onChange(newValue);
      setShowPulse(true);
      onPulse?.();
      setTimeout(() => setShowPulse(false), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3 p-4">
      <label htmlFor={id} className="text-sm font-medium text-slate">
        {label}
      </label>
      
      <div 
        ref={containerRef}
        className="relative w-24 h-24 cursor-pointer select-none"
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        {/* Pulse animation ring */}
        {showPulse && (
          <div className="absolute inset-0 border-2 border-primary rounded-full animate-pulse-ring pointer-events-none" />
        )}
        
        {/* Outer ring */}
        <div className="absolute inset-0 border-2 border-[#6c7680]/30 rounded-full"></div>
        
        {/* Progress arc */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="#23d18b"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${normalizedValue * 188.5} 188.5`}
            className="transition-all duration-150"
          />
        </svg>
        
        {/* Center display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1f25] rounded-full m-3">
          <span className="text-lg font-bold text-foreground">
            {value}
          </span>
          {unit && (
            <span className="text-xs text-slate">
              {unit}
            </span>
          )}
        </div>
        
        {/* Pointer */}
        <div 
          className="absolute top-1 left-1/2 w-1 h-6 bg-primary rounded-full transform -translate-x-1/2 origin-bottom"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        ></div>
      </div>
    </div>
  );
};

export default RotarySlider;
