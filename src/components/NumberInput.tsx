
import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 0.01,
  disabled = false
}) => {
  const increment = () => {
    const newValue = Number((value + step).toFixed(2));
    if (max !== undefined && newValue > max) return;
    onChange(newValue);
  };

  const decrement = () => {
    const newValue = Number((value - step).toFixed(2));
    if (min !== undefined && newValue < min) return;
    onChange(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (isNaN(newValue)) return;
    if (min !== undefined && newValue < min) return onChange(min);
    if (max !== undefined && newValue > max) return onChange(max);
    onChange(newValue);
  };

  return (
    <div className="flex items-center w-full">
      <input
        type="number"
        value={value.toString()}
        onChange={handleChange}
        className="w-full h-10 bg-transparent text-foreground text-lg focus:outline-none"
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={decrement}
          disabled={disabled || (min !== undefined && value <= min)}
        >
          <Minus size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={increment}
          disabled={disabled || (max !== undefined && value >= max)}
        >
          <Plus size={16} />
        </Button>
      </div>
    </div>
  );
};

export default NumberInput;
