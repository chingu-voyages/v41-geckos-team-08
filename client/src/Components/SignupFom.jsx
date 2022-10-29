import { Button } from './Button';

export function SignupForm() {
  return (
    <div className='w-1/2 bg-white p-8 m-0'>
      <h1 className='block w-full text-center text-gray-800 text-2xl font-bold mb-6'>
        Register
      </h1>
      <form className='flex flex-col justify-center' action='/' method='post'>
        <div className='flex flex-col mb-4'>
          <label
            className='mb-2 font-bold text-lg text-gray-900'
            htmlFor='first_name'
          >
            First Name
          </label>
          <input
            className='border py-2 px-3 text-grey-800'
            type='text'
            name='first_name'
            id='first_name'
          />
        </div>
        <div className='flex flex-col mb-4'>
          <label
            className='mb-2 font-bold text-lg text-gray-900'
            htmlFor='last_name'
          >
            Last Name
          </label>
          <input
            className='border py-2 px-3 text-grey-800'
            type='text'
            name='last_name'
            id='last_name'
          />
        </div>
        <div className='flex flex-col mb-4'>
          <label className='mb-2 font-bold text-lg text-gray-900'  htmlFor='email'>
            Trade
          </label>
          <input
            className='border py-2 px-3 text-grey-800'
            type='email'
            name='email'
            id='trade'
          />
        </div>
        <div className='flex flex-col mb-4'>
          <label
            className='mb-2 font-bold text-lg text-gray-900'
            htmlFor='password'
          >
            Location
          </label>
          <input
            className='border py-2 px-3 text-grey-800'
            type='password'
            name='password'
            id='location'
          />
        </div>
        <div className='flex flex-col mb-4'>
          <label
            className='mb-2 font-bold text-lg text-gray-900'
            htmlFor='password'
          >
            E-mail
          </label>
          <input
            className='border py-2 px-3 text-grey-800'
            type='password'
            name='password'
            id='email'
          />
        </div>
        <div className='flex flex-col mb-4'>
          <label
            className='mb-2 font-bold text-lg text-gray-900'
            htmlFor='password'
          >
            Password
          </label>
          <input
            className='border py-2 px-3 text-grey-800'
            type='password'
            name='password'
            id='password'
          />
        </div>
        <div className='flex justify-center'>
            <Button type='submit' value='submit' backgroundColor='primary-200' />
        </div>
        
      </form>
      <a
        className='block w-full text-center no-underline mt-4 text-sm text-black hover:text-secondary-300'
        href='/login'
      >
        Already have an account?
      </a>
    </div>
  );
}
