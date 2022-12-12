import { useState } from 'react';
import { Button } from './Button';
import Error from './Error';
import LandingImage from './../assets/images/Drill.jpg';
import { useDispatch } from 'react-redux';
import { login } from '../Redux/Actions/authActions';

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

  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch(login(userLogin)).then(error => {
      if (error) setError(error.data);
    });
  }

  return (
    <section className='bg-loginForm'>
      <div className='flex flex-wrap items-center justify-center'>
        <div className='px-30 py-40 grow-0 shrink-0 basis-auto lg:px-32 xl:px-40 lg:w-6/12 xl:w-6/12 flex flex-col justify-center items-center'>
          <div>
            <h2 className='mt-6 text-center text-xl sm:text-3xl font-bold text-black'>
              Sign in to your account
            </h2>
          </div>
          <form className='mt-4 space-y-6 w-auto' action='#' method='POST' onSubmit={handleSubmit}>
            <input type='hidden' name='remember' defaultValue='true' />
            <div className='-space-y-px rounded-md shadow-sm w-auto'>
              <div>
                <label htmlFor='email-address' className='sr-only'>
                  Email address
                </label>
                <input
                  data-testid='email'
                  id='email-address'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  className='relative block w-72 sm:w-96 appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
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
                  data-testid='password'
                  id='password'
                  name='password'
                  type='password'
                  autoComplete='current-password'
                  required
                  className='relative block w-72 sm:w-96 appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
                  placeholder='Password'
                  value={password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className='flex justify-center'>
              <Button 
                backgroundColor='tertiary-100' 
                name='Sign In'
                disabled={
                  email === '' ||
                  password === ''
                }
              />
            </div>
          </form>
          {error !== '' &&
            <Error 
              error={error}
            />
          }
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
