import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { Link, useLocation } from 'react-router-dom';
import { useRef } from 'react';
import { store } from '../Redux/Store';
import { useSelector } from 'react-redux';

export const SecondaryNavBar = (props) => {
  const location = useLocation();

  let buttons;

  // const handleClick = () => {
  //   resetStore()
  //   localStorage.clear();
  //   window.location.reload();
  //   window.location.pathname = '/';
  // };
  const { auth } = useSelector(state => state);
  const isSupplier = auth.data.is_supplier;
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  console.log(auth.data.is_supplier);

  if (
    !isSupplier &&
    userInfo &&
    location.pathname === `/user/${userInfo.uuid}`
  ) {
    buttons = (
      <div className='flex flex-col lg:flex-row md:flex-row list-none lg:ml-auto md:ml-auto gap-5'>
        <Button
          backgroundColor='transparent'
          activeEffect='primary-100'
          name='Jobs Posted'
        />

        <Button
          backgroundColor='transparent'
          activeEffect='primary-100'
          name='Jobs in Progress'
        />
      </div>
    );
  } else if (
    isSupplier &&
    userInfo &&
    location.pathname === `/user/${userInfo.uuid}`
  ) {
    buttons = (
      <div className='flex flex-col lg:flex-row md:flex-row list-none lg:ml-auto md:ml-auto gap-5'>
        <Button
          backgroundColor='transparent'
          activeEffect='primary-100'
          name='Jobs Taken'
        />

        <Button
          backgroundColor='transparent'
          activeEffect='primary-100'
          name='Jobs Pending'
        />
      </div>
    );
  }
  const [navBarOpen, setNavBarOpen] = useState(true);
  return (
    <nav className='relative flex flex-wrap justify-between items-center bg-quaternary-100 px-2 py mb-0'>
      <div className='container px-4 mx-auto flex flex-wrap items-center justify-between'>
        <div className='w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start md:w-auto md:static md:block md:justify-start'>
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
          {buttons}
        </div>
      </div>
    </nav>
  );
};
