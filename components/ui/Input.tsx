import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Input: React.FC<InputProps> = ({ label, id, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className="input-label">
        {label}
      </label>
      <input
        id={id}
        className="input"
        {...props}
      />
    </div>
  );
};

export default Input;
