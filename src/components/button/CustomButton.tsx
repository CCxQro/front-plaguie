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
      type="button"
      onClick={onPress}
      className={
        `inline-flex items-center justify-cente
        w-2/3 h-[52px]
         ${bgColor} ${fgColor}
         rounded-s
         drop-shadow-current
         active:opacity-90 transition-opacity`
      }
      disabled={!enabled}
    >
      {title}
    </button>
  );
};

export default CustomButton;
