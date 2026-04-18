import React from 'react';

// define the type that has type, placeholder, height, on change, required
interface InputFieldProps {
  type: string;
  placeholder: string;
  height: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ type, placeholder, height, onChange, required }) => {
  return (
    <input
        type={type}
        placeholder={placeholder}
        className={`w-full ${height} px-4 py-4 bg-white border border-[#CBD5E1] rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)] text-sm text-[#94A3B8]`}
        onChange={onChange}
        required={required}
    />
  );
};

export default InputField;