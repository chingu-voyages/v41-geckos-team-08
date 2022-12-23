import React from 'react';
import { JobCard } from '../Components/JobCard';
import { ProfileCard } from '../Components/ProfileCard';
import UserProfilePic from './../assets/images/measurements.jpg';
import { store } from '../Redux/Store';
import { Button } from '../Components/Button';
import { useSelector } from 'react-redux';
import { useState } from 'react';

export const UserProfile = () => {
  console.log(store.getState());

  const { auth, jobs, proposals } = useSelector((state) => state);

  console.log(jobs);
  console.log(proposals);

  const [buttonAClicked, setButtonAClicked] = useState(true);
  const [buttonBClicked, setButtonBClicked] = useState(false);

  return (
    <div className='bg-white  rounded-sm border-none'>
      <section
        className=' flex justify-center py-32'
        style={{
          backgroundImage: `url(${UserProfilePic})`,
          backgroundSize: 'cover',
        }}
      >
        <ProfileCard />
      </section>

      <section className='bg-tertiary-100'>
        {/* <SecondaryNavBar /> */}
        <div className='flex flex-wrap items-center'>
          <div className='py-0 grow-0 shrink-0 basis-auto w-full'>
            <div className='flex gap-5 justify-center sm:justify-end mt-4 sm:mr-4'>
              <Button
                testId='leftBtn'
                type='submit'
                value={buttonAClicked}
                name={auth.data.is_supplier ? 'Jobs Taken' : 'Jobs Posted'}
                handleClick={() => {
                  setButtonAClicked(true);
                  setButtonBClicked(false);
                }}
                disabled={buttonAClicked}
              />
              <Button
                testId='rightBtn'
                type='submit'
                value={buttonBClicked}
                name={
                  auth.data.is_supplier ? 'Jobs Pending' : 'Jobs In Progress'
                }
                handleClick={() => {
                  setButtonBClicked(true);
                  setButtonAClicked(false);
                }}
                disabled={buttonBClicked}
              />
            </div>
            <div className='flex flex-col justify-center items-center py-12 gap-12 '>
              <h1 data-testid='jobsHeading' className='text-xl font-bold mb-5 text-center text-black'>
                {buttonAClicked
                  ? auth.data.is_supplier
                    ? 'Jobs Taken'
                    : 'Jobs Posted'
                  : auth.data.is_supplier
                  ? 'Jobs Pending'
                  : 'Jobs In Progress'}
              </h1>
              {buttonAClicked &&
                !auth.data.is_supplier &&
                jobs[0].jobs_posted.length === 0 && <h3 data-testid='noJobs' className='font-bold bg-tertiary-100 rounded p-4 shadow-customShadow text-center w-11/12'>Sorry, you don't have any jobs posted.</h3>}
              {buttonAClicked &&
                auth.data.is_supplier &&
                proposals[0].jobs_taken.length === 0 && <h3 data-testid='noJobs' className='font-bold bg-tertiary-100 rounded p-4 shadow-customShadow text-center w-11/12'>Sorry, you don't have any jobs picked up.</h3>}
              {buttonBClicked &&
                !auth.data.is_supplier &&
                jobs[0].jobs_in_progress.length === 0 && <h3 data-testid='noJobs' className='font-bold bg-tertiary-100 rounded p-4 shadow-customShadow text-center w-11/12'>Sorry, you don't have any jobs in progress.</h3>}
              {buttonBClicked &&
                auth.data.is_supplier &&
                proposals[0].jobs_pending.length === 0 && <h3 data-testid='noJobs' className='font-bold bg-tertiary-100 rounded p-4 shadow-customShadow text-center w-11/12'>Sorry, you don't have any jobs waiting to be picked up.</h3>}
              {/* I'm gonna have to add logic later differentiating between Jobs Posted and Jobs Picked Up by Suppliers */}
              {buttonAClicked &&
                !auth.data.is_supplier &&
                jobs.length > 0 &&
                jobs[0].jobs_posted.map((job, index) => {
                  return (
                    <JobCard
                      key={job.uuid}
                      jobUUID={job.uuid}
                      testIndex={index}
                      name={job.customer.name}
                      description={job.description}
                      trade={job.trade.description}
                      expiration_date={job.expiration_date.split('T')[0]}
                      showEditBtn={true}
                      showJobBtn={true}
                      is_supplier={false}
                    />
                  );
                })}
              {buttonAClicked &&
                auth.data.is_supplier &&
                proposals.length > 0 &&
                proposals[0].jobs_taken.map((proposal, index) => {
                  return (
                    <JobCard
                      key={proposal.job.uuid}
                      jobUUID={proposal.job.uuid}
                      testIndex={index}
                      name={proposal.customer.name}
                      description={proposal.job.description}
                      trade={proposal.trade.description}
                      expiration_date={proposal.expiration_date.split('T')[0]}
                      showCompletedBtn={true}
                    />
                  );
                })}
              {buttonBClicked &&
                auth.data.is_supplier &&
                proposals.length > 0 &&
                proposals[0].jobs_pending.map((proposal, index) => {
                  return (
                    <JobCard
                      key={proposal.job.uuid}
                      jobUUID={proposal.job.uuid}
                      testIndex={index}
                      name={proposal.customer.name}
                      description={proposal.job.description}
                      trade={proposal.trade.description}
                      expiration_date={proposal.expiration_date.split('T')[0]}
                      showEditBtn={true}
                      is_supplier={true}
                    />
                  );
                })}
              {buttonBClicked &&
                !auth.data.is_supplier &&
                jobs.length > 0 &&
                jobs[0].jobs_in_progress.map((job, index) => {
                  return (
                    <JobCard
                      key={job.uuid}
                      testIndex={index}
                      name={job.customer.name}
                      description={job.description}
                      trade={job.trade.description}
                      expiration_date={job.expiration_date.split('T')[0]}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
