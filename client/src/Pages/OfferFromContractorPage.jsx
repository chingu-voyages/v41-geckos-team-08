import React from 'react';
import { JobCard } from '../Components/JobCard';
import { NavBar } from '../Components/NavBar';
import { Footer } from './../Components/Footer';
import { Pagination } from './../Components/Pagination'

export const OfferFromContractorPage = () => {
  return (
    <>
      <JobCard />
      <Pagination />
    </>
  );
};