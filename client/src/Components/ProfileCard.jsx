import React from 'react';

export const ProfileCard = () => {
  return (
  
      <div className='w-5/6 h-72 rounded-lg bg-tertiary-100 max-w-2xl max-h-96 text-center m-0 flex flex-col justify-center shadow-customShadow'>
        <div className='p-6 '>
          <h5 className='text-primary-100 text-xl font-extrabold mb-2'>
            Mark Jacobs
          </h5>
          <hr className='my-6 mx-auto w-1/2'></hr>
          <p className='text-black text-base mb-1'>
            <span className='font-bold'>Email:</span> jonh@gmail.com
          </p>
          <p className='text-black text-base mb-1'>
          <span className='font-bold'>Phone:</span> 347-870-7860
          </p>
          <p className='text-black text-base mb-1'>
          <span className='font-bold'>Location:</span> New York
          </p>
        </div>
      </div>

  );
};
