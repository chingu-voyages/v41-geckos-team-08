import React, {useState} from 'react'
import DatePicker from 'react-date-picker'
import { Button } from './Button';

export const JobForm = () => {
    const [value, onChange] = useState(new Date());
  return (
    <div className='w-1/2 bg-white p-8 m-0'>
      <h1 className='block w-full text-center text-gray-800 text-2xl font-bold mb-6'>
        New Job
      </h1>
      <form className='flex flex-col justify-center' action='/' method='post'>
        <div className='flex flex-col mb-4'>
          <label
            className='mb-2 font-bold text-lg text-black'
            htmlFor='first_name'
          >
            First Name
          </label>
          <input
            className='border py-2 px-3 text-black rounded'
            type='text'
            name='first_name'
            id='first_name'
            // value={'any'}
          />
        </div>
        <div className='flex flex-col mb-4'>
          <label
            className='mb-2 font-bold text-lg text-black'
            htmlFor='last_name'
          >
            Last Name
          </label>
          <input
            className='border py-2 px-3 text-black rounded'
            type='text'
            name='last_name'
            id='last_name'
            // value={'any'}
          />
        </div>
        <div className='flex flex-col mb-4'>
          <label
            className='mb-2 font-bold text-lg text-black'
            htmlFor='last_name'
          >
           Job Title
          </label>
          <input
            className='border py-2 px-3 text-black rounded'
            type='text'
            name='job_title'
            id='job_title'
            // value={'any'}
          />
        </div>
        <div className='flex flex-col mb-4'>
          <label
            className='mb-2 font-bold text-lg text-black'
            htmlFor='last_name'
          >
           Description
          </label>
          <textarea
            className='border py-2 px-3 text-black rounded'
            type='text'
            name='description'
            id='description'
            // value={'description'}
          />
        </div>
        <div className='flex flex-col mb-4'>
          <label
            className='mb-2 font-bold text-lg text-black'
            htmlFor='last_name'
          >
            I Need this Done by
          </label>
          <div>
      <DatePicker onChange={onChange} value={value} />
    </div>
        </div>
       
        <div className='flex justify-center'>
            <Button type='submit' value='submit' backgroundColor='primary-200' />
        </div>
        
      </form>
    </div>
  );
}