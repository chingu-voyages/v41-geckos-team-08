import React from 'react';
import { LandingTop } from '../Components/LandingTop';
import { LandingBottom } from './../Components/LandingBottom';
import {store} from './../Redux/Store'

export const LandingPage = () => {

  console.log(store.getState());
 
  return (
    <div className='bg-white rounded-sm border-none flex flex-col'>
      <LandingTop />      
      <LandingBottom />
    </div>
  );
};
