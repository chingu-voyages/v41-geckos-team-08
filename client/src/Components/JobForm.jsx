import React, {useState, useRef} from 'react';
import DatePicker from 'react-date-picker';
import { Button } from './Button';
import LandingImage from './../assets/images/drillBits.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { createJob } from '../Redux/Actions/jobActions';
import { getAPI } from '../Utils/Axios';
import SortAndSearch from './SortAndSearch';
import { store } from '../Redux/Store';

export const JobForm = () => {
  const [date, changeDate] = useState(new Date());

  const initialState = {
    trade_uuid: '',
		city_uuid: '',
		description: '',
		low_price: 1,
		high_price: 1,
		expiration_date: date
  };

  const [newJob, setNewJob] = useState(initialState);
  const [countries, setCountries] = useState([]);

  const { 
    trade_uuid,
		city_uuid,
		description,
		low_price,
		high_price,
		expiration_date 
  } = newJob;

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
      expiration_date: date.toLocaleString()
    });
  }, [date]);

  const [cityInput, setCityInput] = useState('');

  const [filteredCities, setFilteredCities] = useState([]);
  
  useEffect(() => {
    if (cityInput === '') {
      setFilteredCities([]);
      return;
    }
    const _cities = cities.filter(city => city.name.toLowerCase().includes(cityInput.toLowerCase())).slice(0, 5);
    setFilteredCities(_cities);
  }, [cityInput]);
  
  const [selectedTrade, setSelectedTrade] = useState('');

  useEffect(() => {
    setNewJob({
      ...newJob,
      trade_uuid: selectedTrade
    });
  }, [selectedTrade]);

  const cityInputHandler = city => {
    setNewJob({
      ...newJob,
      city_uuid: city.uuid,
    });
    setCityInput(city.name);
  }

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch(createJob(newJob, userInfo.token));
  }

  useEffect(() => {
    console.log(store.getState());
  }, [store]);

  return (
    <div className='flex flex-wrap lg:h-full'>
      <div className='w-full lg:w-1/2 bg-white p-8 m-0'>
        <h1 className='block w-full text-center text-gray-800 text-3xl tracking-tight font-bold mb-6'>
          New Job
        </h1>
        <form className='flex flex-col justify-center' onSubmit={handleSubmit}>
          <div className='flex flex-col mb-4'>
            <label
              className='mb-2 font-bold text-lg text-black'
              htmlFor='countries'
            >
              Countries
            </label>
            <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} className='cursor-pointer'>
              <option default value=''>Select a country</option>
              {countries.map(country => {
                return <option key={country.uuid} value={country.uuid}>{country.name}</option>
              })}
            </select>
          </div>
          <div className='flex flex-col mb-4'>
            <label className={`mb-2 font-bold text-lg text-black ${selectedCountry ? 'text-opacity-100' : 'text-opacity-20'}`} htmlFor='cities'>Cities</label>
            <input className={`${selectedCountry ? 'opacity-100' : 'opacity-20'}`} type='search' value={cityInput} onChange={e => setCityInput(e.target.value)} disabled={selectedCountry === ''} />
            <ul>
              {filteredCities.map(city => (
                <li className='cursor-pointer hover:opacity-60' key={city.uuid} onClick={() => cityInputHandler(city)}>{city.name}</li>
              ))}
            </ul>
          </div>
          <div className='flex flex-col mb-4'>
            <label
              className='mb-2 font-bold text-lg text-black'
              htmlFor='last_name'
            >
            Trade
            </label>
            <select value={selectedTrade} onChange={e => setSelectedTrade(e.target.value)} className='cursor-pointer'>
              <option default value=''>Select a trade</option>
              {/* Placeholder options for now: */}
              <option key={0} value='Trade 0'>Trade 0</option>
              <option key={1} value='Trade 1'>Trade 1</option>
              <option key={2} value='Trade 2'>Trade 2</option>
              <option key={3} value='Trade 3'>Trade 3</option>
            </select>
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
          {/* prices are converted from numbers to strings when changed */}
          <div className='flex flex-col mb-4'>
            <label
              className='mb-2 font-bold text-lg text-black'
              htmlFor='low_price'
            >
            Low Price
            </label>
            <input 
              type='number'
              min={1}
              required
              name='low_price'
              id='low_price'
              value={low_price}
              onChange={handleChange}
            />
            <label
              className='mb-2 font-bold text-lg text-black'
              htmlFor='high_price'
            >
            High Price
            </label>
            <input 
              type='number'
              min={1}
              required
              name='high_price'
              id='high_price'
              value={high_price}
              onChange={handleChange}
            />
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
