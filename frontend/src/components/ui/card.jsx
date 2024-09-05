import React from 'react';

const Card = ({ children, className, onClick }) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md ${className}`}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </div>
  );
};

export default Card;