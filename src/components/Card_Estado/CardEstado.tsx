import React from 'react';

interface CardEstadoProps {
  availableCount?: number;
}

const CardEstado: React.FC<CardEstadoProps> = ({
  availableCount = 85,
}) => {
  const outOfStock = availableCount <= 0;

  return (
    <div className={`box-border flex flex-row items-center px-3 gap-3 w-auto max-w-1/2 h-auto min-h-[74px] border rounded-[10px] ${
      outOfStock
        ? 'bg-[#FEF2F2] border-[#F8B9B9]'
        : 'bg-[#F0FDF4] border-[#B9F8CF]'
    }`}>
      {/* Icon Container */}
      <div className="w-[10%] h-[10%] flex-none relative flex items-center justify-center">
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circle */}
          <path 
            d="M10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667C5.39763 1.66667 1.66667 5.39763 1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333Z" 
            stroke={outOfStock ? '#DC2626' : '#00A63E'}
            strokeWidth="1.66667"
          />
          {outOfStock ? (
            /* X mark */
            <>
              <path
                d="M7.5 7.5L12.5 12.5"
                stroke="#DC2626"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12.5 7.5L7.5 12.5"
                stroke="#DC2626"
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            /* Check mark */
            <path 
              d="M6.25 10L8.75 12.5L14.1667 6.66667" 
              stroke="#00A63E" 
              strokeWidth="1.66667" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          )}
        </svg>
      </div>

      {/* Center Text Container */}
      <div className="flex flex-col items-start flex-grow h-9">
        <span className="font-normal text-xs leading-4 text-[#62748E]">
          Estado de Stock
        </span>
        <span className={`font-bold text-sm leading-5 ${outOfStock ? 'text-[#DC2626]' : 'text-[#008236]'}`}>
          {outOfStock ? 'Sin Stock' : 'En Stock'}
        </span>
      </div>

      {/* Right Text Container */}
      <div className="flex flex-col items-end w-auto h-12">
        <span className="font-normal text-xs leading-4 text-right text-[#62748E]">
          Disponible
        </span>
        <span className="font-bold text-2xl leading-8 text-right text-[#0F172B]">
          {availableCount}
        </span>
      </div>
    </div>
  );
};

export default CardEstado;
