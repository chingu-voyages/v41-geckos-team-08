import React from 'react';
import { JobCard } from '../Components/JobCard';
import {ProfileCard} from '../Components/ProfileCard'
import { NavBar } from '../Components/NavBar';
import { Footer } from './../Components/Footer';
import {Pagination} from './../Components/Pagination'

export const ContractorProfile = () => {
  return (
    <>
      <NavBar />
      <ProfileCard/>
      <JobCard />
      <Pagination/>
      <Footer />
    </>
  );
};