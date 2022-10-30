import React from 'react';
import { Button } from './Button';
import LandingImage from './../assets/images/Drill.jpg';

export const LandingTop = () => {
  return (
    // <div className='container my-24 px-6 mx-auto'>
      <section className='bg-quaternary-300' >
          <div className='flex flex-wrap items-center'>
            <div className='py-40 grow-0 shrink-0 basis-auto w-full lg:w-6/12 xl:w-6/12'>
              <div className=' flex flex-col justify-center items-center lg:items-start px-6 py-12  md:px-12'>
                <h1 className='text-5xl font-bold mb-4 text-center lg:text-left'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. <br/> Quo
                  corrupti, saepe 
                </h1>
                <Button backgroundColor='primary-200'/>
              </div>
            </div>
            <div className='hidden grow-0 shrink-0 basis-90 lg:flex  lg:w-6/12 xl:w-6/12 '>
              <img
                src={LandingImage}
                alt='Trendy Pants and Shoes'
                className='w-full h-screen'
              />
            </div>
          </div>
       
      </section>
    // </div>
  );
};
