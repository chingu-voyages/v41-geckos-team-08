import React from 'react';
import { NavBar } from "../Components/NavBar";
import LoginForm from "../Components/LoginForm";
import { Footer } from "../Components/Footer";

function LoginPage() {
  return (
    <div className='items-start bg-white  rounded-sm border-none flex flex-col'>
      <NavBar />
      <div className='items-start flex gap-3 ml-3 min-w-full'>
        <div className='items-center bg-white rounded-sm border-none flex flex-col gap-153 h-240 py-32 px-0 w-209'>
          <h1 className='tracking-tight leading-10 mr-1 min-h-screen text-center w-175 text-black font-primary text-4xl font-normal not-italic'> Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eius omnis iusto nesciunt labore esse tempore.</h1>
          <LoginForm />
        </div>
        <div className='h-240 w-209'>
          <svg width="837" height="960" viewBox="0 0 837 960" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0H840V960H0V0Z" fill="#E5E5E5"/>
            <path d="M0.5 958.669V1.33072L419.336 480L0.5 958.669ZM1.10186 959.5L420 480.759L838.898 959.5H1.10186ZM839.5 958.669L420.664 480L839.5 1.33072V958.669ZM838.898 0.5L420 479.241L1.10188 0.5H838.898Z" stroke="black" stroke-opacity="0.3"/>
          </svg>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;