import React from 'react';

export const Button = (props) => {
  return (
      <button className={`w-24 inline-flex items-center justify-center px-2 py-0.5 text-base font-medium text-center text-black active:text-tertiary-200 border-1 border-tertiary-100 rounded-lg drop-shadow-lg cursor-pointer  hover:text-primary-300 bg-${props.backgroundColor} active:bg-${props.activeEffect} shadow-${props.customShadow}`} onClick = {props.handleClick}    >
        {/* Button Name will be here probably through props*/}
        {/* example props backgroundColor ='transparent' activeEffect = 'primary-100' */}
       {props.name}
      </button>

  );
};
