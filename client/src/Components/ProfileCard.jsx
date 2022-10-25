import React from 'react';

export const ProfileCard = () => {
  return (
    <div class='flex justify-center'>
      <div class='w-3/5 block rounded-lg shadow-lg bg-tertiary-100 max-w-sm text-center m-0'>
        <div class='p-6'>
          <h5 class='text-primary-100 text-xl font-extrabold mb-2'>
            Mark Jacobs
          </h5>
          <div className='border my-6 w-25 relative left-0'></div>
          <p class='text-black text-base mb-1'>
            <span className='font-bold'>Email:</span> jonh@gmail.com
          </p>
          <p class='text-black text-base mb-1'>
          <span className='font-bold'>Phone:</span> 347-870-7860
          </p>
          <p class='text-black text-base mb-1'>
          <span className='font-bold'>Location:</span> New York
          </p>
        </div>
      </div>
    </div>
  );
};
