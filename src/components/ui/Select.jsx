import React from 'react';

const Select = ({ 
  children, 
  value, 
  onValueChange, 
  className = '',
  placeholder = "Select an option...",
  ...props 
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange && onValueChange(e.target.value)}
      className={`flex h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-soft focus:shadow-medium ${className}`}
      {...props}
    >
      <option value="" disabled>{placeholder}</option>
      {children}
    </select>
  );
};

const SelectItem = ({ value, children, ...props }) => {
  return (
    <option value={value} className="text-gray-900" {...props}>
      {children}
    </option>
  );
};

Select.Item = SelectItem;

export default Select;
