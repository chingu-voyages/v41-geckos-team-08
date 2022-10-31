import './App.css';
import React from 'react'
import {LoginPage} from './Pages/LoginPage'
import { LandingPage } from './Pages/LandingPage';
import {SignUpPage}from './Pages/SignUpPage';
import {AvailableJobsPage} from './Pages/AvailableJobsPage'
import {ContractorProfile} from './Pages/ContractorProfile'
import {JobFormPage} from './Pages/JobFormPage'
import {OfferFromContractorPage} from './Pages/OfferFromContractorPage'
import {UserProfile} from './Pages/UserProfile'
import SortAndSearch from './Components/SortAndSearch';

function App() {
  return (
    <div className="App">
     <ContractorProfile/>
    </div>
  );
}

export default App;
