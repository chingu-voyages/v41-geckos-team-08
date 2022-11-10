import React, { useState } from 'react';
import { Button } from './Button';
import LandingImage from './../assets/images/Drill.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../Redux/Actions/authActions';
import { useDispatch } from 'react-redux';
import {store} from './../Redux/Store'

export const SignUpForm = () => {
  const initialState = {
    name: '',
    email: '',
    password: '',
    is_supplier: false,
    phone: '',
  };

  const [userSignUp, setUserSignUp] = useState(initialState);

  // const { name, email, password, isProvider, phone } = userSignUp;

  const handleChange = (e) => {
   
    const { name, value, type, checked } = e.target;

    setUserSignUp({
      ...userSignUp,
      [name]: type === 'checkbox' ? checked : value,
    });
    // setuserSignUp({
    //   ...userSignUp,
    //   [e.target.name]: e.target.value,

    // });
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userSignUp);
    dispatch(signUp(userSignUp));
    navigate('/login');
  };

  return (
    <div className='flex flex-wrap lg:h-full'>
      <div className='w-full lg:w-1/2 bg-white p-8 m-0'>
        <h1 className='block w-full text-center text-gray-800 text-2xl font-bold mb-6'>
          Register
        </h1>
        <form
          className='flex flex-col justify-center'
          action='/'
          method='POST'
          onSubmit={handleSubmit}
        >
          <div className='flex flex-col mb-4'>
            <label
              className='mb-2 font-bold text-lg text-black '
              htmlFor='email'
            >
              E-mail
            </label>
            <input
              className='border py-2 px-3 text-black rounded'
              type='email'
              name='email'
              id='email'
              placeholder='Email'
              value={userSignUp.email}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col mb-4'>
            <label
              className='mb-2 font-bold text-lg text-black '
              htmlFor='password'
            >
              Password
            </label>
            <input
              className='border py-2 px-3 text-black rounded'
              type='password'
              name='password'
              id='password'
              placeholder='Password'
              value={userSignUp.password}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col mb-4'>
            <label className='mb-2 font-bold text-lg text-black' htmlFor='name'>
              Name
            </label>
            <input
              className='border py-2 px-3 text-black rounded'
              type='text'
              name='name'
              id='name'
              placeholder='Name'
              value={userSignUp.name}
              onChange={handleChange}
            />
          </div>
          <div className='flex flex-col mb-4'>
            <input
              type='checkbox'
              id='is_supplier'
              checked={userSignUp.is_supplier}
              onChange={handleChange}
              name='is_supplier'
            />
            <label
              className='mb-2 font-bold text-lg text-black'
              htmlFor='serviceProvider'
            >
              Service Provider
            </label>
          </div>
          <div className='flex flex-col mb-4'>
            <label
              className='mb-2 font-bold text-lg text-black'
              htmlFor='phone'
            >
              Phone
            </label>
            <input
              className='border py-2 px-3 text-black rounded'
              type='text'
              name='phone'
              id='phone'
              placeholder='phone'
              value={userSignUp.phone}
              onChange={handleChange}
            />
          </div>

          <div className='mt-0 ml-0'>
            <Button
              type='submit'
              value='submit'
              backgroundColor='primary-100'
              name='Sign Up'
            />
          </div>
        </form>
        <Link
          className='block w-full no-underline mt-4 text-sm text-black hover:text-secondary-300'
          to='/login'
        >
          Already have an account?
        </Link>
      </div>
      <div className='hidden grow-0 shrink-0 basis-90 lg:flex lg:w-6/12 xl:w-6/12'>
        <img
          src={LandingImage}
          alt='Trendy Pants and Shoes'
          className='w-full h-fit'
        />
      </div>
    </div>
  );
};
