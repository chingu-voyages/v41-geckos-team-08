import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../Components/Button';
import { JobCard } from '../Components/JobCard';
import { NavBar } from '../Components/NavBar';
import { createProposal } from '../Redux/Actions/proposalActions';
import { getAPI } from '../Utils/Axios';
import { Footer } from './../Components/Footer';
import { Pagination } from './../Components/Pagination';
import PageNotFound from "./PageNotFound";

export const OfferFromContractorPage = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [job, setJob] = useState({});

  const location = useLocation();
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const jobUUID = location.pathname.slice(7);

  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await getAPI(`jobs/${jobUUID}`, userInfo.token);
        setJob(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError(true);
        setLoading(false);
      }
    })();
  }, []);

  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    console.log(job);
    if (Object.keys(job).length > 0) setPrice(job.low_price);
  }, [job]);

  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleSubmit = async e => {
    e.preventDefault();
    const proposal = {
      description,
      expiration_date: job.expiration_date.split('T')[0],
      job_uuid: jobUUID,
      price
    };
    dispatch(createProposal(proposal, userInfo.token));
    navigate(`/user/${auth.data.uuid}`);
  }

  return (
    <div className=''>
      {!loading && error &&
        <PageNotFound />
      }
      {!loading && !error && 
        <div className='my-7'>      
            <JobCard 
              key={job.uuid}
              name={job.customer.name}
              description={job.description}
              trade={job.trade.description}
              expiration_date={job.expiration_date.split('T')[0]}
            />
            <div>
              <form onSubmit={handleSubmit} className='flex flex-col items-center gap-10'>
                <div className='flex flex-col items-center gap-2'>
                  <label htmlFor='proposal'>Proposal:</label>
                  <textarea 
                    type='text'
                    required
                    placeholder="Type your proposal here..."
                    rows={5}
                    cols={40}
                    className='rounded-md'
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <label htmlFor='price'>Price:</label>
                  <input 
                    type='number'
                    required
                    min={job.low_price}
                    max={job.high_price}
                    className='rounded-md'
                    value={price}
                    onChange={e => setPrice(parseInt(e.target.value))}
                  />
                </div>
                 <Button
                    type='submit'
                    value='submit'
                    backgroundColor='primary-100'
                    name='Submit'
                 />
              </form>
            </div>
          {/* <Pagination /> */}
        </div>
      }
    </div>
  );
};