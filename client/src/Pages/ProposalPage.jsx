import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../Components/Button';
import { JobCard } from '../Components/JobCard';
import { ProposalCard } from '../Components/ProposalCard';
import { NavBar } from '../Components/NavBar';
import { createProposal } from '../Redux/Actions/proposalActions';
import { getAPI } from '../Utils/Axios';
import { Footer } from '../Components/Footer';
import { Pagination } from '../Components/Pagination';
import PageNotFound from "./PageNotFound";

export const ProposalPage = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [job, setJob] = useState({});

  const location = useLocation();
  const navigate = useNavigate();
  
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const jobUUID = location.pathname.slice(5);

  const { auth } = useSelector((state) => state);

  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data: jobRes } = await getAPI(`jobs/${jobUUID}`, userInfo.token);
        console.log(jobRes.data);
        if (!auth.data.is_supplier) {
          const { data: proposalsRes } = await getAPI(`proposals?job=${jobUUID}`, userInfo.token);
          console.log(proposalsRes.data);
          setProposals(proposalsRes.data);
        }
        setJob(jobRes.data);
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
    if (Object.keys(job).length > 0) setPrice(job.low_price);
  }, [job]);

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
            {auth.data.is_supplier &&             
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
            }
            {!auth.data.is_supplier &&
              <div className='mt-10'>
                {proposals.length === 0 &&
                  <h1 className='text-center font-bold mb-5'>No proposals have been made for this job, yet.</h1>
                }
                {proposals.length > 0 &&                 
                  <h1 className='text-center font-bold mb-5'>Proposals:</h1>
                }
                {proposals.map(proposal => {
                  return (
                    <ProposalCard 
                      key={proposal.supplier.uuid}
                      supplierUUID={proposal.supplier.uuid}
                      jobUUID={proposal.job.uuid}
                      name={proposal.supplier.name}
                      phone={proposal.supplier.phone}
                      email={proposal.supplier.email}
                      description={proposal.description}
                      price={proposal.price}
                      token={userInfo.token}
                    />
                  );
                })}
              </div>
            }
        </div>
      }
    </div>
  );
};