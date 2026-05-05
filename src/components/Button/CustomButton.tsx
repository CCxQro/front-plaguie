import React from 'react';

type CustomButtonProps = {
  title: string;
  onPress?: () => void; // Lo hacemos opcional porque el submit lo maneja el form
  enabled: boolean;
  bgColor?: string;
  fgColor?: string;
  width?: string;
  height?: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  enabled,
  bgColor = 'bg-[#75C79E]',
  fgColor = 'text-[#0F172A]',
  width = 'w-full',
  height = 'h-13',
}) => {
  return (
    <button
      type="submit"
      // Añadimos active:scale-95 para el efecto visual y transition para suavidad
      className={`${width} ${height} ${bgColor} ${fgColor} font-bold text-sm leading-6 rounded-lg 
      shadow-[0px_1px_2px_rgba(0,0,0,0.05)] transition-all duration-200 
      active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={onPress}
      disabled={!enabled}
    >
      {title} 
    </button>
  );
};

export default CustomButton;