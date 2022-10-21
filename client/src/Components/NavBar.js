import React from 'react';

export const NavBar = (props) => {
  return (

      <header className='flex justify-around items-center bg-primary'>
        <div className='flex justify-start'>
          <h2 className=''>LOGO</h2>
        </div>
        <div className='flex gap-6'>
          <button className='border-2 p-1'>{props.login}</button>
          <button className='border-2 p-1'>{props.signup}</button>
          <button></button>
        </div>
      </header>

  );
};
