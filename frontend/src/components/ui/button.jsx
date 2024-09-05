// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ children, variant, className, onClick }) => {
  const baseClasses = "px-4 py-2 rounded focus:outline-none";
  const variantClasses = variant === "outline" ? "border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white" : "bg-gray-800 text-white";

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
