import React from 'react';

export const LandingBottom = () => {
  return (
    <section className='m-0 p-10 text-black bg-quaternary-200'>
      
      <div className='flex justify-center items-center lg:justify-start px-12 py-0 md:px-9'>
            <h2 className='text-2xl font-bold mb-4 pr-0 text-center lg:text-left lg:pr-96 lg:mr-40'>
                Here's what Handy Work can do for you
              </h2>
          </div>
        <div className='flex flex-wrap items-center'>
          <div className='py-0 grow-0 shrink-0 basis-auto w-full md:w-6/12 lg:w-6/12 xl:w-6/12'>
            <div className='flex flex-col justify-center items-center md:items-start px-6 py-0  md:px-9'>
              <h4 className='text-xl font-medium my-3'>
                YOU set the terms for your job
              </h4>
              <p>
                Anywhere in the world, you can set the terms for the job you need to get done. The trade you need, how you want the job done, the prices you want. It's all up to you.
              </p>
              <h4 className='text-xl font-medium my-3'>
                YOU set the terms for your offer
              </h4>
              <p>
                No matter where you are in the world, Handy Work offers you selections for gigs that are available in your area. You can create the offer you want to satisfy your customer.
              </p>
            </div>
          </div>
          <div className='py-0 grow-0 shrink-0 basis-auto w-full md:w-6/12 lg:w-6/12 xl:w-6/12'>
            <div className=' flex flex-col justify-center items-center md:items-start px-6 py-0  md:px-9'>
              <h4 className='text-xl font-medium my-3'>
                YOU can choose what offer to accept
              </h4>
              <p>
                Handy Work gives you the choice on what offer you want to accept for your job. You can choose whatever offer satisfies your terms the best.
              </p>
              <h4 className='text-xl font-medium my-3'>
                YOU can get work for your trade
              </h4>
              <p>
                No matter where you are in the world, you can make an offer for a gig and have it accepted. Handy Work is the all-in-one place where you can find work orders that suits your skillset the best.
              </p>
            </div>
          </div>
        </div>
    
    </section>
  );
};
