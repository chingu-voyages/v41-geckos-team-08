import './App.css';
import React from 'react'
import {LoginPage} from './Pages/LoginPage'
import {LandingPage }from './Pages/LandingPage';
import {SignUpPage}from './Pages/SignUpPage';
import {AvailableJobsPage} from './Pages/AvailableJobsPage'
import {ContractorProfile} from './Pages/ContractorProfile'
import {JobFormPage} from './Pages/JobFormPage'
import {OfferFromContractorPage} from './Pages/OfferFromContractorPage'
import {UserProfile} from './Pages/UserProfile'

function App() {
  return (
    <div className="App">
     <LandingPage />
    </div>
  );
}

export default App;
