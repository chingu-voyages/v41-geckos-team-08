import React from "react";

export const Button = (props) => {
	return (
		<button
			className={`w-auto inline-flex items-center justify-center px-2 py-0.5 text-base font-medium text-center text-black active:text border-1 border-tertiary-100 rounded-lg drop-shadow-lg cursor-pointer  ${props.disabled ? '' : 'hover:bg-primary-100'} ${props.disabled ? '' : 'hover:text-white'} bg-${props.backgroundColor} active:bg-${props.activeEffect} shadow-${props.customShadow}`}
			disabled={props.disabled}
			value={props.value}
			onClick={props.handleClick}>
			{/* Button Name will be here probably through props*/}
			{/* example props backgroundColor ='transparent' activeEffect = 'primary-100' */}
			{props.name}
		</button>
	);
};
