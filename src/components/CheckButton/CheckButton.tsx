import React from 'react';

interface CheckButtonProps {
  remember: boolean;
  setRemember: (value: boolean) => void;
  width?: string;
  height?: string;
  text: string;
}

const CheckButton: React.FC<CheckButtonProps> = ({
  remember,
  setRemember,
  width = 'w-4',
  height = 'h-4',
  text,
}) => {
  return (
    <div className="flex items-center space-x-3">
      <input
        type="checkbox"
        checked={remember}
        onChange={(e) => setRemember(e.target.checked)}
        className={`${width} ${height} border border-[#CBD5E1] rounded`}
      />
      <label className="text-sm font-normal leading-5 text-[#475569]">
        {text}
      </label>
    </div>
  );
};

export default CheckButton;