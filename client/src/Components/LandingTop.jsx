import React from 'react';
import { Button } from './Button';

export const LandingTop = () => {
  return (
    // <div className='container my-24 px-6 mx-auto'>
      <section className='mb-32 text-black'>
        <div className='block bg-quaternary-100'>
          <div className='flex flex-wrap items-center'>
            <div className='py-40 grow-0 shrink-0 basis-auto w-full md:w-6/12 lg:w-6/12 xl:w-6/12'>
              <div className=' flex flex-col justify-center items-center md:items-start px-6 py-12  md:px-12'>
                <h1 className='text-5xl font-bold mb-4 text-center md:text-left'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. <br/> Quo
                  corrupti, saepe 
                </h1>
                <Button backgroundColor='primary-200'/>
              </div>
            </div>
            <div className='hidden md:flex grow-0 shrink-0 basis-90 md:w-6/12 lg:w-6/12 xl:w-6/12'>
              {/* <img
                src='https://mdbootstrap.com/img/new/ecommerce/vertical/088.jpg'
                alt='Trendy Pants and Shoes'
                className='w-full'
              /> */}
            </div>
          </div>
        </div>
      </section>
    // </div>
  );
};
