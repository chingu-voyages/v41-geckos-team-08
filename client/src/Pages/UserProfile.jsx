import React from 'react';
import { JobCard } from '../Components/JobCard';
import { ProfileCard } from '../Components/ProfileCard';
import { NavBar } from '../Components/NavBar';
import { Footer } from './../Components/Footer';
import { Pagination } from './../Components/Pagination';
import UserProfilePic from './../assets/images/measurements.jpg';
import SortAndSearch from '../Components/SortAndSearch';

export const UserProfile = () => {
  return (
    <div className='bg-white  rounded-sm border-none'>
        <section className=' flex justify-center py-32' style={{backgroundImage: `url(${UserProfilePic})`, backgroundSize: 'cover'}}>
          <ProfileCard />
        </section>

        <section className='bg-primary-300'> 
        <NavBar />
          <div className='flex flex-wrap items-center'>
            <div className='py-0 grow-0 shrink-0 basis-auto w-full'>
              <div className=' flex flex-col justify-center items-center py-12 gap-12 '>
                <h1 className='text-xl font-bold mb-0 text-center text-quaternary-300'>
                  Jobs Posted
                </h1>
                <SortAndSearch />
                <JobCard />
                <Pagination />
              </div>
            </div>
          </div>
        </section>
      </div>
  
  );
};
