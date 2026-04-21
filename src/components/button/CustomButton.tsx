import React from 'react';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  enabled: boolean;
  bgColor?: string;
  fgColor?: string;
};

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  enabled,
  bgColor = 'bg-[#75C79E]',
  fgColor = 'text-[#0F172A]',
}) => {
  return (
    <button
      type="submit"
      className={`w-full h-13 ${bgColor} ${fgColor} font-bold text-sm leading-6 rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)]`}
      onClick={undefined}
      disabled={!enabled}
    >
      Iniciar Sesión
    </button>
  );
};

export default CustomButton;
