import React, {useState, useRef} from 'react';
import DatePicker from 'react-date-picker';
import { Button } from './Button';
import LandingImage from './../assets/images/drillBits.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { createJob } from '../Redux/Actions/jobActions';
import { getAPI } from '../Utils/Axios';
import SortAndSearch from './SortAndSearch';

export const JobForm = () => {
  const [date, changeDate] = useState(new Date());

  const initialState = {
    first_name: '',
    last_name: '',
    city: '',
    job_title: '',
    description: '',
    date
  };

  const [newJob, setNewJob] = useState(initialState);
  const [countries, setCountries] = useState([]);

  const { first_name, last_name, job_title, description } = newJob;

  const handleChange = e => setNewJob({
    ...newJob,
    [e.target.name]: e.target.value
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    (async () => {
      const { data: _countries } = await getAPI(`locations`, userInfo.token);
      setCountries(_countries.data);
    })();
  }, [userInfo.token]);

  // 1. Get the value of the current selected country
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    console.log(countries);
  }, [countries]);

  useEffect(() => {
    if (selectedCountry === '' && cities.length > 0) setCities([]);
    if (selectedCountry !== '') {
      setCityInput('');
      (async () => {
        const { data: _cities } = await getAPI(`locations/${selectedCountry}`, userInfo.token);
        setCities(_cities.data);
      })();
    }
  }, [selectedCountry, userInfo.token]);

  // 2. Use the country value's uuid to query the server for the cities
  const [selectedCity, setSelectedCity] = useState('');
  // 3. Set the cities array's state to the data array returned from the query
  const [cities, setCities] = useState([]);
  // 4. Set the selected city's value to the city key in the form

  useEffect(() => {
    console.log(cities);
  }, [cities]);

  useEffect(() => {
    setNewJob({
      ...newJob,
      date
    });
  }, [date]);

  const [cityInput, setCityInput] = useState('');

  const cityInputHandler = e => {
    const lower = e.target.value.toLowerCase();
    setCityInput(lower);
  }

  const [filteredCities, setFilteredCities] = useState([]);

  useEffect(() => {
    if (cityInput === '') {
      setFilteredCities([]);
      return;
    }
    const _cities = cities.filter(city => city.name.toLowerCase().includes(cityInput)).slice(0, 5);
    setFilteredCities(_cities);
  }, [cityInput]);

  const [disabled, setDisabled] = useState(true);

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
              htmlFor='countries'
            >
              Countries
            </label>
            <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
              <option default value=''>Select a country</option>
              {countries.map(country => {
                return <option key={country.uuid} value={country.uuid}>{country.name}</option>
              })}
            </select>
          </div>
          <div className='flex flex-col mb-4'>
            <label className={`mb-2 font-bold text-lg text-black ${selectedCountry ? 'text-opacity-100' : 'text-opacity-20'}`} htmlFor='cities'>Cities</label>
            <input className={`${selectedCountry ? 'opacity-100' : 'opacity-20'}`} type='search' value={cityInput} onChange={cityInputHandler} disabled={selectedCountry === ''} />
            <ul>
              {filteredCities.map(city => (
                <li key={city.uuid}>{city.name}</li>
              ))}
            </ul>
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
              <button type="submit" className='w-12 h-12'>Submit</button>
              {/* <Button type='submit' value='submit' backgroundColor='black' /> */}
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
