import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {LoginPage} from './Pages/LoginPage'
import { LandingPage } from './Pages/LandingPage';
import {SignUpPage}from './Pages/SignUpPage';
import {AvailableJobsPage} from './Pages/AvailableJobsPage'
import {ContractorProfile} from './Pages/ContractorProfile'
import {JobFormPage} from './Pages/JobFormPage'
import {OfferFromContractorPage} from './Pages/OfferFromContractorPage'
import {UserProfile} from './Pages/UserProfile'
import SortAndSearch from './Components/SortAndSearch';
import { NavBar } from './Components/NavBar';
import { Footer } from './Components/Footer';

function App() {
  return (
    <div className="App">
     <Router>
      <NavBar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/jobs' element={<AvailableJobsPage />} />
        <Route path='/supplier/:id' element={<ContractorProfile />} />
        <Route path='/new_job' element={<JobFormPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/offer/:id' element={<OfferFromContractorPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/user/:id' element={<UserProfile />} />
      </Routes>
      <Footer />
     </Router>
    </div>
  );
}

export default App;
