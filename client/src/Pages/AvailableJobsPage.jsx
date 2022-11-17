import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { JobCard } from '../Components/JobCard';
import { NavBar } from '../Components/NavBar';
import SortAndSearch from '../Components/SortAndSearch';
import { getAPI } from '../Utils/Axios';
import { Footer } from './../Components/Footer';
import { Pagination } from './../Components/Pagination';
import { Button } from '../Components/Button';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const AvailableJobsPage = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [city, setCity] = useState('');
  const [jobs, setJobs] = useState([]);

  const [noJobs, setNoJobs] = useState('');

  const navigate = useNavigate();

  const { proposals } = useSelector(state => state);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { data: res } = await getAPI(`jobs?city=${city}`, userInfo.token);
      const _proposals = proposals[0].jobs_pending.filter(proposal => proposal.city.name.toLowerCase() === city.toLowerCase());
      console.log(_proposals);
      const arr = res.data.filter(job => job.is_taken === false).filter(job => !_proposals.find(proposal => job.uuid === proposal.job.uuid));
      console.log(arr);
      setJobs(arr);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (jobs.length > 0 && noJobs) setNoJobs('');
    if (jobs.length === 0 && city !== '') setNoJobs(city);
    setCity('');
  }, [jobs]);

  return (
    <div className='h-screen'>
      <h1 className='font-bold text-center my-5'>Available Jobs</h1>
      <form
        className='container p-4 mx-auto flex flex-row items-center justify-center'
        onSubmit={handleSubmit}
      >
        <div className='flex flex-row items-center'>
          <label
            className='mb-0 mx-2 font-bold text-lg text-black'
            htmlFor='city'
          >
            City:
          </label>
          <input
            className='border py-2 px-3 text-black rounded'
            type='text'
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder='City'
          />
        </div>
        <div className='mt-0 ml-2'>
          <Button
            type='submit'
            value='submit'
            backgroundColor='primary-100'
            name='Search'
          />
        </div>
      </form>
      <div>
        {jobs.length === 0 && noJobs !== '' &&
          <h1>No jobs available in {noJobs}</h1>
        }
        {jobs.length > 0 && (
          <h3 className='text-xl font-bold mb-5 text-center text-primary-200'>
            Showing results for {jobs[0].city.name}
          </h3>
        )}
        {jobs.map((job) => {
          return (
            <JobCard
              onClick={() => navigate(`/job/${job.uuid}`)}
              key={job.uuid}
              name={job.customer.name}
              description={job.description}
              trade={job.trade.description}
              expiration_date={job.expiration_date.split('T')[0]}
            />
          );
        })}
      </div>
      {jobs.length > 10 && <Pagination />}
    </div>
  );
};
