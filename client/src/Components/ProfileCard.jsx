import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { store } from '../Redux/Store';
import { Button } from './Button';

export const ProfileCard = () => {
  const { auth } = useSelector(state => state);

  const navigate = useNavigate();

  let formatPhoneNumber = (str) => {
    //Filter only numbers from the input
    let cleaned = ('' + str).replace(/\D/g, '');
    
    //Check if the input is of correct length
    let match = cleaned.match(/^(\d{3})(\d{4,10})$/);
  
    if (match) {
      return '(' + match[1] + ') ' + match[2] 
    };
  
    return null
  };

  return (
    <div className='w-5/6 h-72 rounded-lg bg-tertiary-100 max-w-2xl max-h-96 text-center m-0 flex flex-col justify-center shadow-customShadow'>
      <div className='p-6 '>
        <h5 className='text-primary-100 text-xl font-extrabold mb-2'>
          {auth.data.name}
        </h5>
        <hr className='my-6 mx-auto w-1/2'></hr>
        <p className='text-black text-base mb-1'>
          <span className='font-bold'>Email:</span> {auth.data.email}
        </p>
        <p className='text-black text-base mb-1'>
          <span className='font-bold'>Phone:</span> {formatPhoneNumber(auth.data.phone)}
        </p>
        <p className='text-black text-base mb-1 font-semibold'>
          <span className='font-bold'></span> {auth.data.is_supplier ? "Service Provider" : ""} 
        </p>
        <Button 
          backgroundColor="primary-100"
          name="Edit Profile"
          handleClick={() => navigate(`/edit_user/${auth.data.uuid}`)}
        />
        {/* <p className='text-black text-base mb-1'>
          <span className='font-bold'>Location:</span> not Available
        </p> */}
      </div>
    </div>
  );
};
