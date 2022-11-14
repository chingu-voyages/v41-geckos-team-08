import React from 'react';
import { Button } from './Button';


export const JobCard = (props) => {
  return (
    <div key={props.uuid} className='container mx-auto px-3 sm:px-20 mb-5'>
      <div>
        <div className='bg-primary rounded p-4 shadow-customShadow md:flex justify-between bg-tertiary-100'>
          <div data-v-648b5d7b=''>
            <h4 className='text-2xl font-semibold'>{props.name}</h4>

            <p className='my-2 text-lg pr-2'>
              {props.description}
            </p>
            <div className='flex items-center mt-4'>
              <div className='text-xs uppercase font-bold tracking-wider bg-gray-300 inline-block px-0 py-1 rounded mr-6'>
                Skills Required: {props.trade}
              </div>
              <div className='text-xs uppercase font-bold tracking-wider bg-gray-300 inline-block px-0 py-1 rounded mr-6'>
                Due Date: {props.expiration_date}
              </div>
            </div>
          </div>
          <div className='text-right md:ml-8 flex items-center'>
            <div className='flex md:block -mx-0 md:flex-col md:mx-0 mt-3 md:mt-0'>
              <Button
                backgroundColor='primary-200'
                textColor='white'
                actionEffect='secondary-300'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
