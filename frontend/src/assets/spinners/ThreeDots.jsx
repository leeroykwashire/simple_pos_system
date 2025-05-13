import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

const ThreeDotsSpinner = ({ color = '#3498db', height = 80, width = 80 }) => {
  return (
    <ThreeDots
      color={color}
      height={height}
      width={width}
      ariaLabel="loading"
    />
  );
};

export default ThreeDotsSpinner;
