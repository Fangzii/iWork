import React from 'react';

function Loading() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="dot-loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
}

export default Loading;
