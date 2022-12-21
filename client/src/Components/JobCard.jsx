import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { completeJob } from '../Redux/Actions/proposalActions';
import { Button } from './Button';
import Error from './Error';

export const JobCard = (props) => {

  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const dispatch = useDispatch();

  const [error, setError] = useState('');

  const finishJob = () => {
    dispatch(completeJob(props.jobUUID, userInfo.token)).then(error => {
      if (error) setError(error.data.detail);
    });
  }

  return (
    <div key={props.uuid} onClick={props.onClick} className={`${props.onClick ? 'cursor-pointer' : ''} container mx-auto px-3 sm:px-20 mb-5`}>
      <div>
        <div className='bg-primary rounded p-4 shadow-customShadow md:flex justify-between bg-tertiary-100'>
          <div data-v-648b5d7b=''>
            <h4 data-testid='jobName' className='text-2xl font-semibold'>{props.name}</h4>

            <p data-testid='jobDescription' className='my-2 text-lg pr-2'>
              {props.description}
            </p>
            <div className='flex items-center mt-4'>
              <div data-testid='jobTrade' className='text-xs uppercase font-bold tracking-wider bg-gray-300 inline-block px-0 py-1 rounded mr-6'>
                Skills Required: {props.trade}
              </div>
              <div data-testid='jobExpiration' className='text-xs uppercase font-bold tracking-wider bg-gray-300 inline-block px-0 py-1 rounded mr-6'>
                Due Date: {props.expiration_date}
              </div>
            </div>
            <div className="flex justify-center sm:justify-start mr-2 sm:mr-0 gap-3 mt-2">
              {props.showEditBtn &&             
                <div className='flex gap-3 mt-2'>
                  <Button
                    testId='editBtn'
                    backgroundColor='tertiary-100'
                    textColor='white'
                    actionEffect='secondary-300'
                    name='Edit'
                    handleClick={() => navigate(props.is_supplier ? `/job/${props.jobUUID}?edit` : `/new_job?job=${props.jobUUID}`)}
                    bolder='font-semibold'
                  />
                </div>
              }
              {props.showJobBtn &&             
                <div className='flex gap-3 mt-2'>
                    <Button
                      testId='jobBtn'
                      backgroundColor='tertiary-100'
                      textColor='white'
                      actionEffect='secondary-300'
                      name='Go to Job Page'
                      handleClick={() => navigate(`/job/${props.jobUUID}`)}
                      bolder='font-semibold'
                    />
                </div>
              }
              {props.showCompletedBtn &&             
                <div className='flex gap-3 mt-2'>
                    <Button
                      testId='finishBtn'
                      backgroundColor='tertiary-100'
                      textColor='white'
                      actionEffect='secondary-300'
                      name='Job Complete'
                      handleClick={finishJob}
                      bolder='font-semibold'
                    />
                </div>
              }
              {error !== '' &&
                <div className="flex justify-center sm:justify-start mt-2">
                  <Error 
                    error={error}
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
