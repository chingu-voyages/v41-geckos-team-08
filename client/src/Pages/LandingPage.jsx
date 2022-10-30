import React from 'react';
import {LandingTop} from '../Components/LandingTop'
import { NavBar } from '../Components/NavBar';
import {LandingBottom} from './../Components/LandingBottom'
import {Footer} from './../Components/Footer'



export const LandingPage = () => {
  return (
    <>
    <NavBar/>
    <LandingTop/>
    <LandingBottom/>
    <Footer/>
    </>
  );
}

