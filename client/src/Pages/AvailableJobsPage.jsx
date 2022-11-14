import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { JobCard } from '../Components/JobCard';
import { NavBar } from '../Components/NavBar';
import SortAndSearch from '../Components/SortAndSearch';
import { getAPI } from '../Utils/Axios';
import { Footer } from './../Components/Footer';
import {Pagination} from './../Components/Pagination'

export const AvailableJobsPage = () => {

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  
  const [city, setCity] = useState('');
  const [jobs, setJobs] = useState([]);

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      const { data: res } = await getAPI(`jobs?city=${city}`, userInfo.token);
      console.log(res.data);
      setJobs(res.data);
      setCity('');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor='city'>City:</label>
        <input 
          type='text' 
          required
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder='City'
        />
        <button type='submit'>Submit</button>
      </form>
      <div>
        {jobs.length > 0 && 
          <h3>Showing results for {jobs[0].city.name}</h3>
        }
        {jobs.map(job => {
          return (
            <JobCard 
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