import React from 'react';
import { JobCard } from '../Components/JobCard';
import { NavBar } from '../Components/NavBar';
import SortAndSearch from '../Components/SortAndSearch';
import { Footer } from './../Components/Footer';
import {Pagination} from './../Components/Pagination'

export const AvailableJobsPage = () => {
  return (
    <>
      <NavBar />
      <SortAndSearch />
      <JobCard />
      <JobCard />
      <JobCard />
      <JobCard />
      <JobCard />
      <Pagination/>
      <Footer />
    </>
  );
};