import React from 'react';

export const NavBar = (props) => {
  return (
    <header className='flex justify-around items-center bg-primary py-3'>
      <div className='flex justify-start'>
        <h2 className=''>LOGO</h2>
      </div>
      <div className='flex gap-6'>
        <button className='border-2 py-1 px-2 w-32 rounded-md bg-tertiary'>
          {props.login}
        </button>
        <button className='border-2 py-1 px-2 w-32 rounded-md bg-tertiary'>
          {props.signup}
        </button>
        <button></button>
      </div>
    </header>
  );
};
