import React from 'react';

interface CardEstadoProps {
  stockLabel?: string;
  stockStatus?: string;
  availableLabel?: string;
  availableCount?: number | string;
}

const CardEstado: React.FC<CardEstadoProps> = ({
  stockLabel = 'Estado de Stock',
  stockStatus = 'En Stock',
  availableLabel = 'Disponible',
  availableCount = 85,
}) => {
  return (
    <div className="box-border flex flex-row items-center px-3 gap-3 w-[400px] h-[74px] bg-[#F0FDF4] border border-[#B9F8CF] rounded-[10px]">
      {/* Icon Container */}
      <div className="w-5 h-5 flex-none relative flex items-center justify-center">
        {/* Icon based on the provided vectors (Check circle) */}
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Vector 1: Outer shape */}
          <path 
            d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" 
            stroke="#00A63E" 
            strokeWidth="1.66667"
          />
          {/* Vector 2: Inner check */}
          <path 
            d="M6.25 10L8.75 12.5L14.1667 6.66667" 
            stroke="#00A63E" 
            strokeWidth="1.66667" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Center Text Container */}
      <div className="flex flex-col items-start flex-grow h-9">
        <span className="font-normal text-xs leading-4 text-[#62748E]">
          {stockLabel}
        </span>
        <span className="font-bold text-sm leading-5 text-[#008236]">
          {stockStatus}
        </span>
      </div>

      {/* Right Text Container */}
      <div className="flex flex-col items-end w-[60px] h-12">
        <span className="font-normal text-xs leading-4 text-right text-[#62748E]">
          {availableLabel}
        </span>
        <span className="font-bold text-2xl leading-8 text-right text-[#0F172B]">
          {availableCount}
        </span>
      </div>
    </div>
  );
};

export default CardEstado;
