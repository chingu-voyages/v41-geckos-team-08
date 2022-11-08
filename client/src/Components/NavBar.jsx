import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import Logo from './Logo';
import { Link, useLocation } from 'react-router-dom';
import { useRef } from 'react';

export const NavBar = (props) => {
  const location = useLocation();

  let buttons;

  const handleClick = () => {
    localStorage.clear();
    window.location.reload();
    window.location.pathname = '/';
  };

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (location.pathname === '/') {
    buttons = (
      <div className='flex flex-col lg:flex-row md:flex-row list-none lg:ml-auto md:ml-auto gap-2'>
        <Link to='/signup'>
          <Button
            backgroundColor='transparent'
            activeEffect='primary-100'
            name='Sign Up'
          />
        </Link>
        <Link to='/login'>
          <Button
            backgroundColor='transparent'
            activeEffect='primary-100'
            name='Login'
          />
        </Link>
      </div>
    );
  } else if (location.pathname === '/login') {
    buttons = (
      <div className='flex flex-col lg:flex-row md:flex-row list-none lg:ml-auto md:ml-auto gap-2'>
        <Link to='/signup'>
          <Button
            backgroundColor='transparent'
            activeEffect='primary-100'
            name='Sign Up'
          />
        </Link>
      </div>
    );
  } else if (location.pathname === '/signup') {
    buttons = (
      <div className='flex flex-col lg:flex-row md:flex-row list-none lg:ml-auto md:ml-auto gap-2'>
        <Link to='/login'>
          <Button
            backgroundColor='transparent'
            activeEffect='primary-100'
            name='Login'
          />
        </Link>
      </div>
    );
  } else if (userInfo && location.pathname === `/user/${userInfo.uuid}`) {
    buttons = (
      <div className='flex flex-col lg:flex-row md:flex-row list-none lg:ml-auto md:ml-auto gap-2'>
        <Link to='/new_job'>
          <Button
            backgroundColor='transparent'
            activeEffect='primary-100'
            name='Post New Job'
          />
        </Link>
        <Link to='/jobs'>
          <Button
            backgroundColor='transparent'
            activeEffect='primary-100'
            name='Available Jobs'
          />
        </Link>
        <Link to='/'>
          <Button
            backgroundColor='transparent'
            activeEffect='primary-100'
            name='Sign Out'
            handleClick={handleClick}
          />
        </Link>
      </div>
    );
  } else if (userInfo && location.pathname === `/jobs`) {
    buttons = (
      <div className='flex flex-col lg:flex-row md:flex-row list-none lg:ml-auto md:ml-auto gap-2'>
        <Link to='/new_job'>
          <Button
            backgroundColor='transparent'
            activeEffect='primary-100'
            name='Post New Job'
          />
        </Link>
        <Link to={`/user/${userInfo.uuid}`}>
          <Button
            backgroundColor='transparent'
            activeEffect='primary-100'
            name='Profile'
          />
        </Link>
        <Link to='/'>
          <Button
            backgroundColor='transparent'
            activeEffect='primary-100'
            name='Sign Out'
            handleClick={handleClick}
          />
        </Link>
      </div>
    );
  } else if (userInfo && location.pathname === `/new_job`) {
    buttons = (
      <div className='flex flex-col lg:flex-row md:flex-row list-none lg:ml-auto md:ml-auto gap-2'>
        <Link to='/jobs'>
          <Button
            backgroundColor='transparent'
            activeEffect='primary-100'
            name='Available Jobs'
          />
        </Link>
        <Link to={`/user/${userInfo.uuid}`}>
          <Button
            backgroundColor='transparent'
            activeEffect='primary-100'
            name='Profile'
          />
        </Link>
        <Link to='/'>
          <Button
            backgroundColor='transparent'
            activeEffect='primary-100'
            name='Sign Out'
            handleClick={handleClick}
          />
        </Link>
      </div>
    );
  }

  const [navBarOpen, setNavBarOpen] = useState(true);
  return (
    <nav className='relative flex flex-wrap justify-between items-center bg-quaternary-100 px-2 py mb-0'>
      <div className='container px-4 mx-auto flex flex-wrap items-center justify-between'>
        <div className='w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start md:w-auto md:static md:block md:justify-start'>
          <Link className='inline-block mr-4 py-2 whitespace-nowrap' to='/'>
            <Logo />
          </Link>
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
