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
import { useNavigate } from 'react-router-dom';

export const JobForm = () => {
  const [date, changeDate] = useState(new Date());

  const initialState = {
    trade_uuid: '',
		city_uuid: '',
		description: '',
		low_price: 1,
		high_price: 1,
		expiration_date: date.toISOString().split('T')[0]
  };

  const [newJob, setNewJob] = useState(initialState);
  const [countries, setCountries] = useState([]);
  const [trades, setTrades] = useState([]);

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
    [e.target.name]: e.target.type === 'number' ? parseInt(e.target.value) : e.target.value
  });

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    (async () => {
      const { data: _countries } = await getAPI(`locations`, userInfo.token);
      setCountries(_countries.data);
      const { data: _trades } = await getAPI('trades', userInfo.token);
      const tradesArr = _trades.data
        .filter(trade => trade.description.substring(0, 2) !== '{{')
        .sort((a, b) => a.description.localeCompare(b.description))
        .map(trade => ({
          ...trade,
          description: trade.description.charAt(0).toUpperCase() + trade.description.slice(1).toLowerCase()
      }));
      console.log(tradesArr);
      setTrades(tradesArr);
    })();
  }, [userInfo.token]);

  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    console.log(countries);
  }, [countries]);

  useEffect(() => {
    if (selectedCountry === '' && cities.length > 0) {
      setCityInput('');
      setCities([]);
      setFilteredCities([]);
    } 
    if (selectedCountry !== '') {
      setCityInput('');
      (async () => {
        const { data: _cities } = await getAPI(`locations/${selectedCountry}`, userInfo.token);
        setCities(_cities.data);
      })();
    }
  }, [selectedCountry, userInfo.token]);

  const [cities, setCities] = useState([]);

  useEffect(() => {
    console.log(cities);
  }, [cities]);

  useEffect(() => {
    setNewJob({
      ...newJob,
      expiration_date: date.toISOString().split('T')[0]
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

  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    console.log(newJob);
    dispatch(createJob(newJob, userInfo.token));
    navigate(`/user/${auth.data.uuid}`);
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
              {trades.map(trade => {
                return <option key={trade.uuid} value={trade.uuid}>{trade.description}</option>
              })}
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
