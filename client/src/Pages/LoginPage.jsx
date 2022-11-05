import React from 'react';
import { NavBar } from "../Components/NavBar";
import { LoginForm } from "../Components/LoginForm";
import { Footer } from "../Components/Footer";

export const LoginPage=()=> {
  return (
    <div className='bg-white  rounded-sm border-none flex flex-col'>
      <LoginForm />
    </div>
  );
}
  