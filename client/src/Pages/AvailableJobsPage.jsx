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

  const [selectedCountry, setSelectedCountry] = useState('');
  const [countries, setCountries] = useState([]);

  const [cityInput, setCityInput] = useState('');
  const [cityUUID, setCityUUID] = useState('');
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [cityInputToggled, setCityInputToggled] = useState(false);

  const cityInputHandler = (city) => {
    setFilteredCities([]);
    setCityInputToggled(true);
    setCityInput(city.name);
    setCityUUID(city.uuid);
  };

  const [jobs, setJobs] = useState([]);

  const [noJobs, setNoJobs] = useState('');

  const navigate = useNavigate();

  const { proposals } = useSelector(state => state);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log(cityUUID);
      const { data: res } = await getAPI(`jobs?city=${cityUUID}`, userInfo.token);
      console.log(res);
      const _proposals = proposals[0].jobs_pending.filter(proposal => proposal.city.name.toLowerCase() === cityInput.toLowerCase());
      console.log(_proposals);
      const arr = res.data.filter(job => job.is_taken === false).filter(job => !_proposals.find(proposal => job.uuid === proposal.job.uuid));
      console.log(arr);
      setJobs(arr);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { data: _countries } = await getAPI(`locations`, userInfo.token);
        setCountries(_countries.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedCountry === '' && cities.length > 0) {
      setCityInput('');
      setCityUUID('');
      setCities([]);
      setFilteredCities([]);
    }
    if (selectedCountry !== '') {
      setCityInput('');
      setCityUUID('');
      (async () => {
        const { data: _cities } = await getAPI(
          `locations/${selectedCountry}`,
          userInfo.token
        );
        setCities(_cities.data);
      })();
    }
  }, [selectedCountry, userInfo.token]);

  useEffect(() => {
    if (cityInput === '') {
      setFilteredCities([]);
      if (cityUUID !== '') setCityUUID('');
      return;
    }
    const _cities = cities
      .filter((city) =>
        city.name.toLowerCase().includes(cityInput.toLowerCase())
      )
      .slice(0, 5);
    if (!cityInputToggled) setFilteredCities(_cities);
    if (cityInputToggled) setCityInputToggled(false);
  }, [cityInput, cityUUID]);

  useEffect(() => {
    if (filteredCities.length > 0 && cityUUID !== '') setCityUUID('');
  }, [filteredCities]);

  useEffect(() => {
    if (jobs.length > 0 && noJobs) setNoJobs('');
    if (jobs.length === 0 && cityInput !== '') setNoJobs(cityInput);
    setCityInput('');
    setCityUUID('');
  }, [jobs]);

  return (
    <div className='h-full'>
      <h1 className='font-bold text-center my-5'>Available Jobs</h1>
      <form
        className='container p-4 mx-auto flex flex-col items-center justify-center'
        onSubmit={handleSubmit}
      >
        <div className='flex flex-col mb-4'>
                <label
                  className='mb-2 font-bold text-lg text-black text-center'
                  htmlFor='countries'
                >
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className='cursor-pointer w-72'
                >
                  <option default value=''>
                    Select a country
                  </option>
                  {countries.map((country) => {
                    return (
                      <option key={country.uuid} value={country.uuid}>
                        {country.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className='flex flex-col mb-4'>
                <label
                  className={`mb-2 font-bold text-lg text-black text-center ${
                    selectedCountry ? 'text-opacity-100' : 'text-opacity-20'
                  }`}
                  htmlFor='cities'
                >
                  City
                </label>
                <input
                  className={`w-72 ${selectedCountry ? 'opacity-100' : 'opacity-20'}`}
                  type='search'
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  disabled={selectedCountry === ''}
                  maxLength={((cityUUID !== '') || (filteredCities.length === 0 && cityInput !== '')) ? cityInput.length : null}
                />
                <ul>
                  {filteredCities.map((city) => (
                    <li
                      className='cursor-pointer hover:opacity-60 text-black'
                      key={city.uuid}
                      onClick={() => cityInputHandler(city)}
                    >
                      {city.name}
                    </li>
                  ))}
                </ul>
        </div>
        <div className='mt-0 ml-2'>
          <Button
            type='submit'
            value='submit'
            backgroundColor='tertiary-100'
            name='Search'
            disabled={(filteredCities.length === 0 && cityUUID === '') || (filteredCities.length > 0)}
          />
        </div>
      </form>
      <div>
        {jobs.length === 0 && noJobs !== '' &&
          <h1 className='mt-2 text-center font-semibold text-2xl px-4'>Sorry, there are no jobs available in {noJobs}.</h1>
        }
        {jobs.length > 0 && (
          <h3 className='text-xl px-4 font-bold my-8 text-center text-black'>
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
    </div>
  );
};
