import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  
  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    className
  ].join(' ').trim();

  return (
    <button
      className={classNames}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
