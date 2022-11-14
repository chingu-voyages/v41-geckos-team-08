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
import { AUTH, GET_JOBS } from './Redux/ActionTypes';
import AuthRoute from './AuthRoute';
import {store} from './Redux/Store';
import { checkTokenExp } from './Utils/CheckTokenExp';
import { logout } from './Redux/Actions/authActions';

function App() {

  const [loading, setLoading] = useState(true);
  const { auth, jobs } = useSelector((state) => state);
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
        // const tokenActive = await checkTokenExp(token);
        // if (!tokenActive) {
        //   // logout();
        //   setLoading(false);
        //   return;
        // }
        const { data: authRes } = await getAPI(`users/${uuid}`, token);
        dispatch({
          type: AUTH,
          payload: authRes
        });

        if (jobs.length === 0 && authRes.data.is_supplier === false) {
          const { data: jobsRes } = await getAPI('jobs', token);
          if (jobsRes) {
            dispatch({
              type: GET_JOBS,
              payload: jobsRes.data
            });
          }
        } else if (jobs.length === 0 && authRes.data.is_supplier) {
          
        }
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
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
          <Route path='/jobs' element={<AuthRoute><AvailableJobsPage /></AuthRoute>} />
          <Route path='/supplier/:id' element={<AuthRoute><ContractorProfile /></AuthRoute>} />
          <Route path='/new_job' element={<AuthRoute><JobFormPage /></AuthRoute>} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/offer/:id' element={<AuthRoute><OfferFromContractorPage /></AuthRoute>} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/user/:id' element={<AuthRoute><UserProfile /></AuthRoute>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
        <Footer />
      </Router>
     }
    </div>
  );
}

export default App;
