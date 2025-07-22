import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none btn-hover-lift';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-soft hover:shadow-medium',
    secondary: 'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 focus:ring-secondary-500 border border-secondary-200',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 focus:ring-primary-500 text-gray-700',
    ghost: 'hover:bg-gray-100 focus:ring-primary-500 text-gray-600 hover:text-gray-900',
    destructive: 'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500 shadow-soft',
    success: 'bg-success-500 text-white hover:bg-success-600 focus:ring-success-500 shadow-soft',
    gradient: 'gradient-primary text-white hover:opacity-90 focus:ring-primary-500 shadow-glow'
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg',
    xl: 'h-14 px-8 text-xl',
    icon: 'h-10 w-10'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
