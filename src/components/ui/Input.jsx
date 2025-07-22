import React from 'react';

const Input = React.forwardRef(({ 
  type = 'text', 
  className = '', 
  placeholder,
  value,
  onChange,
  disabled = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={`flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-soft focus:shadow-medium ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;
