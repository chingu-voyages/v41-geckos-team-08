import React from "react";

export const Button = (props) => {
	return (
		<button
			className={`w-auto inline-flex items-center justify-center px-2 py-0.5 text-base font-medium text-center text-black active:text border-1 border-tertiary-100 rounded-lg drop-shadow-lg ${props.disabled ? '' : 'cursor-pointer'} ${props.disabled ? 'opacity-50' : 'opacity-100'} active:bg-${props.activeEffect} shadow-${props.customShadow} ${props.hoverColor ? `hover:bg-${props.hoverColor}` : ''} bg-${props.backgroundColor} ${props.bolder ? `${props.bolder}` : ''}`}
			disabled={props.disabled}
			value={props.value}
			onClick={props.handleClick}
			data-testid={props.testId}>
			{/* Button Name will be here probably through props*/}
			{/* example props backgroundColor ='transparent' activeEffect = 'primary-100' */}
			{props.name}
		</button>
	);
};
