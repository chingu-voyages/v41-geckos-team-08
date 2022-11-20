import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Loading from '../Components/Loading';
import Error from '../Components/Error';
import { Button } from '../Components/Button';
import { JobCard } from '../Components/JobCard';
import { ProposalCard } from '../Components/ProposalCard';
import { createProposal, updateProposal } from '../Redux/Actions/proposalActions';
import { getAPI } from '../Utils/Axios';
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

  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data: jobRes } = await getAPI(`jobs/${jobUUID}`, userInfo.token);
        console.log(jobRes.data);
        if (!auth.data.is_supplier || location.search === "?edit") {
          const { data: proposalsRes } = await getAPI(`proposals?job=${jobUUID}`, userInfo.token);
          if (auth.data.is_supplier) {
            const [proposal] = proposalsRes.data.filter(proposal => proposal.supplier.uuid === auth.data.uuid);
            setDescription(proposal.description);
            setPrice(proposal.price);
          } else {
            setProposals(proposalsRes.data);
          }
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

  useEffect(() => {
    if (Object.keys(job).length > 0 && location.search !== "?edit") setPrice(job.low_price);
  }, [job]);

  const dispatch = useDispatch();

  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    const proposal = {
      description,
      expiration_date: job.expiration_date.split('T')[0],
      job_uuid: jobUUID,
      price
    };
    if (location.search === "?edit") {
      dispatch(updateProposal(auth.data.uuid, jobUUID, proposal, userInfo.token)).then(error => {
        error ? setErrorMsg(error.data.detail) : navigate(`/user/${auth.data.uuid}`);
      });
    } else {
      dispatch(createProposal(proposal, userInfo.token)).then(error => {
        error ? setErrorMsg(error.data.detail) : navigate(`/user/${auth.data.uuid}`);
      });
    }
  }

  return (
    <div>
      {loading && !error &&
        <Loading />
      }
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
                    <label htmlFor='proposal' className='font-semibold text-xl mb-2'>Proposal:</label>
                    <textarea 
                      type='text'
                      required
                      placeholder="Type your proposal here..."
                      rows={5}
                      cols={40}
                      className='rounded-md w-11/12 sm:w-full'
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                    />
                  </div>
                  <div className='flex items-center gap-2'>
                    <label htmlFor='price'
                    className='font-semibold text-xl'>Price:</label>
                    <span className='font-semibold text-lg mt-1'>$</span>
                    <input 
                      type='number'
                      required
                      min={job.low_price}
                      max={job.high_price}
                      className='rounded-md'
                      value={price}
                      onChange={e => setPrice(parseInt(e.target.value))}
                    />
                    <span className='font-semibold text-lg mt-1'>.00</span>
                  </div>
                  <Button
                      type='submit'
                      value='submit'
                      backgroundColor='tertiary-100'
                      name='Submit'
                      disabled={description === ''}
                  />
                </form>
                {errorMsg !== '' &&
                  <div className="flex justify-center sm:justify-start mt-2">
                    <Error 
                     error={errorMsg}
                    />
                  </div>
                }
              </div>
            }
            {!auth.data.is_supplier &&
              <div className='mt-10'>
                {proposals.length === 0 &&
                  <h1 className='text-center font-bold mb-5 text-xl sm:text-2xl'>No proposals have been made for this job, yet.</h1>
                }
                {proposals.length > 0 &&                 
                  <h1 className='text-center font-bold mb-5 text-xl sm:text-2xl'>Proposals:</h1>
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
                      user={auth.data.uuid}
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