import React from 'react';

const CardContent = ({ children, className }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-6 ${className}`}>
      {children}
    </div>
  );
};

export default CardContent;