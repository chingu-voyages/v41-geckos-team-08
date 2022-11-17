import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { acceptJobProposal } from '../Redux/Actions/jobActions';
import { Button } from './Button';

export const ProposalCard = (props) => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const acceptProposal = () => {
   dispatch(acceptJobProposal(props.supplierUUID, props.jobUUID, props.token));
   navigate(`/user/${props.user}`);
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

            <p className='my-2 text-lg pr-2'>
              {props.description}
            </p>
            <div className='flex items-center mt-4'>
              <div className='text-xs uppercase font-bold tracking-wider bg-gray-300 inline-block px-0 py-1 rounded mr-6'>
                Offered Price: {props.price}
              </div>
            </div>
            <div className='flex gap-3 mt-2'>
              <Button
                backgroundColor='primary-100'
                textColor='white'
                actionEffect='secondary-300'
                name='Accept'
                handleClick={acceptProposal}
              />
            </div>
          </div>
          <div className='text-right md:ml-8 flex'>
          </div>
        </div>
      </div>
    </div>
  );
};
