import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import LandingImage from './../assets/images/Drill.jpg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signUp, updateUser } from '../Redux/Actions/authActions';
import { useSelector, useDispatch } from 'react-redux';
import Loading from './Loading';

export const UserForm = () => {
  const initialState = {
    name: '',
    email: '',
    password: '',
    is_supplier: false,
    phone: '',
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || "{}";
  const [userInputs, setUserInputs] = useState(initialState);

  // const { name, email, password, isProvider, phone } = userInputs;

  const [selectedOption, setSelectedOption] = useState(false);

  const handleChange = (e) => {
    setUserInputs({
      ...userInputs,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setUserInputs({
      ...userInputs,
      is_supplier: selectedOption,
    });
  }, [selectedOption]);

  // Trade is a separate state because only the supplier is required to have a trade, not the customer
  const [trade, setTrade] = useState('');
  const [loading, setLoading] = useState(true);

  const { auth } = useSelector((state) => state);

  useEffect(() => {
    if (trade !== '') {
      setUserInputs({
        ...userInputs,
        trades: [trade.toLowerCase()]
      });
    }
    if (Object.keys(auth).length > 0 && trade !== '' && loading) setLoading(false);
  }, [trade]);

  useEffect(() => {
    if (Object.keys(auth).length === 0) {
      setLoading(false);
      return;
    }
    const { data } = auth;
    setUserInputs({
      name: data.name,
      email: data.email,
      is_supplier: data.is_supplier,
      phone: data.phone,
      password: ''
    });
    if (data.is_supplier) {
      setTrade(data.trades[0].description);
    } else {
      setLoading(false);
    }
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(userInputs);
  }, [userInputs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userInputs);
    if (Object.keys(auth).length > 0) {
      dispatch(updateUser(userInputs, auth.data.uuid, userInfo.token));
      navigate(`/user/${auth.data.uuid}`);
    } else {
      dispatch(signUp(userInputs));
      navigate('/login');
    }
  };

  return (
    <>    
      {loading && 
        <Loading />
      }
      {!loading &&     
        <div className='flex flex-wrap lg:h-full'>
          <div className='w-full lg:w-1/2 bg-white p-8 m-0'>
            <h1 className='block w-full text-center text-gray-800 text-2xl font-bold mb-6'>
              {Object.keys(auth).length > 0 ? 'Update User' : 'Register'}
            </h1>
            <form
              className='flex flex-col justify-center'
              action='/'
              method='POST'
              onSubmit={handleSubmit}
            >
              <div className='flex flex-col mb-4'>
                <label className='mb-3 sm:mb-2 font-bold text-lg text-black text-center sm:text-start' htmlFor='name'>
                  Name
                </label>
                <input
                  className='border py-2 px-3 text-black rounded'
                  type='text'
                  name='name'
                  id='name'
                  placeholder='Name'
                  value={userInputs.name}
                  onChange={handleChange}
                  required={Object.keys(auth).length === 0}
                />
              </div>
              <div className='flex flex-col mb-4'>
                <label
                  className='mb-3 sm:mb-2 font-bold text-lg text-black text-center sm:text-start'
                  htmlFor='phone'
                >
                  Phone
                </label>
                <input
                  className='border py-2 px-3 text-black rounded'
                  type='text'
                  name='phone'
                  id='phone'
                  placeholder='(123) 456-7890'
                  value={userInputs.phone}
                  onChange={handleChange}
                  required={Object.keys(auth).length === 0}
                />
              </div>
              <div className='flex flex-col mb-4'>
                <label
                  className='mb-3 sm:mb-2 font-bold text-lg text-black text-center sm:text-start'
                  htmlFor='email'
                >
                  Email
                </label>
                <input
                  className='border py-2 px-3 text-black rounded'
                  type='email'
                  name='email'
                  id='email'
                  placeholder='example@email.com'
                  value={userInputs.email}
                  onChange={handleChange}
                  required={Object.keys(auth).length === 0}
                />
              </div>
              <div className='flex flex-col mb-4'>
                <label
                  className='mb-3 sm:mb-2 font-bold text-lg text-black text-center sm:text-start'
                  htmlFor='password'
                >
                  {Object.keys(auth).length > 0 ? 'New Password' : 'Password'}
                </label>
                <input
                  className='border py-2 px-3 text-black rounded'
                  type='password'
                  name='password'
                  id='password'
                  placeholder={Object.keys(auth).length > 0 ? 'New Password (Optional)' : 'Password'}
                  value={userInputs.password}
                  onChange={handleChange}
                  required={Object.keys(auth).length === 0}
                />
              </div>
              <div className='flex flex-col mb-4'>
                {Object.keys(auth).length === 0 &&
                  <div className='flex flex-col sm:flex-row items-center gap-3'>                  
                    <label
                      className='font-bold text-lg text-black'
                      htmlFor='serviceProvider'
                    >
                      Are you a service provider?
                    </label>
                    <div className='flex gap-10 sm:gap-3'>
                      <div className='flex items-center gap-2'>
                        <input
                          type='radio'
                          checked={selectedOption}
                          value={true}
                          onChange={() => setSelectedOption(true)}
                          name='is_supplier'
                          required
                        />
                        <label
                          className='font-bold text-lg text-black'
                          htmlFor='serviceProvider'
                        >
                          Yes
                        </label>
                      </div>
                      <div className='flex items-center gap-2'>
                        <input
                          type='radio'
                          value={false}
                          checked={!selectedOption}
                          onChange={() => setSelectedOption(false)}
                          name='is_supplier'
                          required
                        />
                        <label
                          className='font-bold text-lg text-black'
                          htmlFor='serviceProvider'
                        >
                          No
                        </label>
                      </div>
                    </div>
                  </div>                
                }
                {(Object.keys(auth).length === 0 || auth.data.is_supplier) && 
                  <div className={`${userInputs.is_supplier ? '' : 'hidden'} mt-3 flex flex-col`}>                  
                    <label
                      className="mt-2 mb-3 sm:mb-2 font-bold text-lg text-black text-center sm:text-start"
                      htmlFor='trade'
                    >
                      Trade
                    </label>
                    <input
                      className={`${userInputs.is_supplier ? 'opacity-100' : 'opacity-60'}`}
                      type='text'
                      id='trade'
                      value={trade}
                      onChange={e => setTrade(e.target.value)}
                      name='trade'
                      placeholder='Trade'
                      required={userInputs.is_supplier ?  true : false}
                    />
                  </div>                
                }
              </div>

              <div className='flex justify-center sm:justify-start'>
                <Button
                  type='submit'
                  value='submit'
                  backgroundColor='tertiary-100'
                  name={Object.keys(auth).length > 0 ? 'Update' : 'Sign Up'}
                  disabled={
                    userInputs.name === '' ||
                    userInputs.email === '' ||
                    userInputs.password === '' ||
                    userInputs.phone === '' ||
                    (userInputs.is_supplier ? trade === '' : null)
                  }
                />
              </div>
            </form>
            {/* {Object.keys(auth).length === 0 &&            
              <Link
                className='block w-full no-underline mt-4 text-sm text-black hover:text-secondary-300'
                to='/login'
              >
                Already have an account?
              </Link>
            } */}
          </div>
          <div className='hidden grow-0 shrink-0 basis-90 lg:flex lg:w-6/12 xl:w-6/12'>
            <img
              src={LandingImage}
              alt='Trendy Pants and Shoes'
              className='w-full h-fit'
            />
          </div>
        </div>
      }
    </>
  );
};
