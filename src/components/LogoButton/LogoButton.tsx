import React from 'react';

export type LogoButtonProps = {
  title: string;
  icon: React.ReactNode;
  onPress?: () => void;
  width?: string;
  height?: string;
  disabled?: boolean;
};

const LogoButton: React.FC<LogoButtonProps> = ({
  title,
  icon,
  onPress,
  width = 'w-38',
  height = 'h-10',
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      className={`
        ${width} ${height}
        relative flex flex-row justify-center items-center
        px-3 py-2 gap-3
        bg-[#F8FAFC] rounded-lg
        font-inter font-semibold text-sm leading-6 text-[#0F172A]
        transition-all duration-200
        active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:bg-[#F1F5F9]
        cursor-pointer
      `}
    >
      {/* Border overlay — inset box-shadow matching Figma */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-lg shadow-[inset_0px_0px_0px_1px_#CBD5E1] pointer-events-none"
      />

      {/* Icon */}
      {icon && (
        <span className="flex-none w-5 h-5 z-[1] flex items-center justify-center">
          {icon}
        </span>
      )}

      {/* Label */}
      {title && (
        <span className="flex-none z-[2] flex items-center text-center whitespace-nowrap">
          {title}
        </span>
      )}
    </button>
  );
};

export default LogoButton;
