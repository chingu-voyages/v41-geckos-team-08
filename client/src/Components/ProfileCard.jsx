import React from 'react';
import { store } from '../Redux/Store';

export const ProfileCard = () => {
  const userInfo = store.getState().auth.data;
  console.log(userInfo);


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
          {userInfo.name}
        </h5>
        <hr className='my-6 mx-auto w-1/2'></hr>
        <p className='text-black text-base mb-1'>
          <span className='font-bold'>Email:</span> {userInfo.email}
        </p>
        <p className='text-black text-base mb-1'>
          <span className='font-bold'>Phone:</span> {formatPhoneNumber(userInfo.phone)}
        </p>
        <p className='text-black text-base mb-1 font-semibold'>
          <span className='font-bold'></span> {userInfo.is_supplier ? "Service Provider" : ""} 
        </p>
        {/* <p className='text-black text-base mb-1'>
          <span className='font-bold'>Location:</span> not Available
        </p> */}
      </div>
    </div>
  );
};
