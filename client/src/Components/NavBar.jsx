import React, { useState } from 'react';
import { Button } from './Button';

export const NavBar = (props) => {
  const [navBarOpen, setNavBarOpen] = useState(true);
  return (
    <nav className='relative flex flex-wrap justify-between items-center bg-quaternary-100 px-2 py mb-0'>
      <div className='container px-4 mx-auto flex flex-wrap items-center justify-between'>
        <div className='w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start md:w-auto md:static md:block md:justify-start'>
          <a className='inline-block mr-4 py-2 whitespace-nowrap ' href='#home'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2}
              stroke='currentColor'
              className='w-8 h-7'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495'
              />
            </svg>
          </a>
          <button
            className='text-quaternary-100 cursor-pointer text-lg leading-none px-3 py-1 border-solid border-transparent rounded bg-transparent block md:hidden outline-none focus:outline-none'
            type='button'
            onClick={() => {
              setNavBarOpen(!navBarOpen);
              console.log('hi');
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={2}
              stroke='currentColor'
              className='w-6 h-6  '
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'
              />
            </svg>
          </button>
        </div>
        <div
          className={
            'lg:flex md:flex flex-grow items-center justify-center py-1 ' +
            (navBarOpen ? ' flex' : ' hidden')
          }
        >
          <div className='flex flex-col lg:flex-row md:flex-row list-none lg:ml-auto md:ml-auto gap-2'>
            {/* Buttons or links will be placed here */}
            <Button backgroundColor ='transparent' activeEffect = 'primary-100'/>
            <Button backgroundColor ='transparent' activeEffect = 'primary-100'/>
          </div>
        </div>
      </div>
    </nav>
  );
};
