import React, { useEffect, useState } from 'react';
import PageNotFound from './Pages/PageNotFound';
import Loading from './Components/Loading';

function AuthRoute({ children }) {

  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
   const userInfo = localStorage.getItem("userInfo");
   if (userInfo) setIsLoggedIn(true);
   setLoading(false);
  }, []);

  return (
    <>
     {!loading && isLoggedIn && children}
     {!loading && !isLoggedIn && <PageNotFound />}
     {loading && <Loading />}
    </>
  );
}

export default AuthRoute;