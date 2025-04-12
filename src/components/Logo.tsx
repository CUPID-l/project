
import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 40, className = "" }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 512 512" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect 
          x="60" 
          y="30" 
          width="392" 
          height="452" 
          rx="60" 
          stroke="#10B981" 
          strokeWidth="30" 
        />
        <path 
          d="M256 180C256 180 200 240 200 280C200 313.137 225.49 340 256 340C286.51 340 312 313.137 312 280C312 240 256 180 256 180Z" 
          stroke="#10B981" 
          strokeWidth="24" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M256 180V120" 
          stroke="#10B981" 
          strokeWidth="24" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default Logo;
