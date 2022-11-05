import React, {useState} from 'react'
import DatePicker from 'react-date-picker'
import { Button } from './Button';
import LandingImage from './../assets/images/drillBits.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { createJob } from '../Redux/Actions/jobActions';

export const JobForm = () => {
  const [date, changeDate] = useState(new Date());

  const initialState = {
    first_name: '',
    last_name: '',
    job_title: '',
    description: '',
    date
  };

  const [newJob, setNewJob] = useState(initialState);

  const { first_name, last_name, job_title, description } = newJob;

  const handleChange = e => setNewJob({
    ...newJob,
    [e.target.name]: e.target.value
  });

  useEffect(() => {
    setNewJob({
      ...newJob,
      date
    });
  }, [date]);

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!auth.access_token) return;
    dispatch(createJob(newJob, auth.access_token));
  }

  return (
    <div className='flex flex-wrap lg:h-full'>
      <div className='w-full lg:w-1/2 bg-white p-8 m-0'>
        <h1 className='block w-full text-center text-gray-800 text-3xl tracking-tight font-bold mb-6'>
          New Job
        </h1>
        <form className='flex flex-col justify-center' action='/' method='POST' onSubmit={handleSubmit}>
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
              value={first_name}
              onChange={handleChange}
              required
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
              value={last_name}
              onChange={handleChange}
              required
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
              value={job_title}
              onChange={handleChange}
              required
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
              value={description}
              onChange={handleChange}
              required
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
              <DatePicker
                value={date}
                onChange={changeDate}
                required 
              />
            </div>
          </div>
          <div className='mt-3 -ml-6'>
              <Button type='submit' value='submit' backgroundColor='primary-200' />
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
  );
}
