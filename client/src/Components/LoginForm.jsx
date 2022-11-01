import { useState } from 'react';
import { Button } from './Button';
import LandingImage from './../assets/images/Drill.jpg';
import { useDispatch } from 'react-redux';
import { login } from '../Redux/Actions/authActions';
// import { Link } from 'react-router-dom';

export function LoginForm() {

  const initialState = {
    email: '',
    password: ''
  };

  const [userLogin, setUserLogin] = useState(initialState);

  const { email, password } = userLogin;

  const handleChange = e => setUserLogin({
    ...userLogin,
    [e.target.name]: e.target.value
  });

  const dispatch = useDispatch();

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch(login(userLogin));
  }

  return (
    <section className='bg-primary-100'>
      <div className='flex flex-wrap items-center justify-center'>
        <div className='px-30 py-40 grow-0 shrink-0 basis-auto lg:px-32 xl:px-40 lg:w-6/12 xl:w-6/12'>
          <div>
            <h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-quaternary-100'>
              Sign in to your account
            </h2>
          </div>
          <form className='mt-8 space-y-6' action='#' method='POST' onSubmit={handleSubmit}>
            <input type='hidden' name='remember' defaultValue='true' />
            <div className='-space-y-px rounded-md shadow-sm'>
              <div>
                <label htmlFor='email-address' className='sr-only'>
                  Email address
                </label>
                <input
                  id='email-address'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  className='relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  placeholder='Email address'
                  value={email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor='password' className='sr-only'>
                  Password
                </label>
                <input
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  className='relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  placeholder='Password'
                  value={password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  id='remember-me'
                  name='remember-me'
                  type='checkbox'
                  className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                />
                <label
                  htmlFor='remember-me'
                  className='ml-2 block text-sm text-gray-900'
                >
                  Remember me
                </label>
              </div>

              <div className='text-sm'>
                {/* <Link to="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </Link> */}
              </div>
            </div>

            <div>
              <Button backgroundColor='tertiary-100'/>
            </div>
          </form>
        </div>
        <div className='hidden grow-0 shrink-0 basis-90 lg:flex lg:w-6/12 xl:w-6/12 '>
          <img
            src={LandingImage}
            alt='Trendy Pants and Shoes'
            className='w-full h-screen'
          />
        </div>
      </div>
    </section>
  );
}
