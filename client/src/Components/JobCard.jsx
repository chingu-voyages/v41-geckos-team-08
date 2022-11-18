import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';

export const JobCard = (props) => {

  const navigate = useNavigate();

  return (
    <div onClick={props.onClick} key={props.uuid} className='cursor-pointer container mx-auto px-3 sm:px-20 mb-5'>
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
            <div className="flex justify-center sm:justify-start mr-2 sm:mr-0 gap-3 mt-2">
              {props.showEditBtn &&             
                <div className='flex gap-3 mt-2'>
                  <Button
                    backgroundColor='primary-100'
                    textColor='white'
                    actionEffect='secondary-300'
                    name='Edit'
                    handleClick={() => navigate(props.is_supplier ? `/job/${props.jobUUID}?edit` : `/new_job?job=${props.jobUUID}`)}
                  />
                </div>
              }
              {props.showJobBtn &&             
                <div className='flex gap-3 mt-2'>
                    <Button
                      backgroundColor='primary-100'
                      textColor='white'
                      actionEffect='secondary-300'
                      name='Go to Job Page'
                      handleClick={() => navigate(`/job/${props.jobUUID}`)}
                    />
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
