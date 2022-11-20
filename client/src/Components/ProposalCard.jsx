import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { acceptJobProposal } from '../Redux/Actions/jobActions';
import { Button } from './Button';
import Error from './Error';

export const ProposalCard = (props) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const acceptProposal = () => {
   dispatch(acceptJobProposal(props.supplierUUID, props.jobUUID, props.token)).then(error => {
    error ? setError(error.data.detail) : navigate(`/user/${props.user}`);
   });
  }

  return (
    <div onClick={props.onClick} key={props.supplierUUID} className='cursor-pointer container mx-auto px-3 sm:px-20 mb-5'>
      <div>
        <div className='bg-primary rounded p-4 shadow-customShadow md:flex justify-between bg-tertiary-100'>
          <div data-v-648b5d7b=''>
            <h4 className='text-2xl font-semibold'>{props.name}</h4>
            <div className='my-4'>
             <h5 className='text-lg font-medium'>Email: {props.email}</h5>
             <h5 className='text-lg font-medium'>Phone: {props.phone}</h5>
            </div>

            <p className='my-2 font-semibold text-lg pr-2'>
              {props.description}
            </p>
            <div className='flex items-center mt-4'>
              <div className='text-xs uppercase font-bold tracking-wider bg-gray-300 inline-block px-0 py-1 rounded mr-6'>
                Offered Price: ${props.price}.00
              </div>
            </div>
            <div className='flex gap-3 mt-2'>
              <Button
                backgroundColor='tertiary-100'
                textColor='white'
                actionEffect='secondary-300'
                name='Accept'
                handleClick={acceptProposal}
              />
            </div>
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
  );
};
