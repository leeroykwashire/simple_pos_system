import React from 'react';
import { Circles } from 'react-loader-spinner';

const CirclesSpinner = () => {
  return (
    <Circles
      //colors={["rgba(245, 245, 255, 0.959)", "gray",]}
      color='lightgray'
      height={100} 
      width={100} 
      timeout={3000}

    />
  );
};

export default CirclesSpinner;
