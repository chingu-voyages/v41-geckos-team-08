import './App.css';
import React, { useState, useEffect } from 'react';
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
import Loading from './Components/Loading';
import PageNotFound from './Pages/PageNotFound';
import { getAPI } from './Utils/Axios';
import { useDispatch, useSelector } from 'react-redux';
import { AUTH } from './Redux/ActionTypes';

function App() {

  const [loading, setLoading] = useState(true);
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.length !== undefined) {
      setLoading(false);
      return;
    }
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      setLoading(false);
      return;
    }

    const getUserInfo = async () => {
      const { token, uuid } = userInfo;
      try {
        const res = await getAPI(`users/${uuid}`, token);
        dispatch({
          type: AUTH,
          payload: res.data
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    getUserInfo();
  }, []);

  return (
    <div className="App">
     {!loading &&     
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
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </Router>
     }
    </div>
  );
}

export default App;
