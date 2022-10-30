import React from 'react';
import { NavBar } from "../Components/NavBar";
import { LoginForm } from "../Components/LoginForm";
import { Footer } from "../Components/Footer";

function LoginPage() {
  return (
    <div className='bg-white  rounded-sm border-none flex flex-col'>
      <NavBar />
      <section className='mb-0 text-black'>
        <div className='block bg-quaternary-100'>
          <div className='flex flex-wrap items-center'>
            <div className='py-0 grow-0 shrink-0 basis-auto w-full lg:w-6/12 xl:w-6/12'>
              <div className=' flex flex-col justify-center items-center px-6 py-12  md:px-12'>
                <h1 className='text-5xl font-bold mb-4 text-center'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. <br/> Quo
                  corrupti, saepe 
                </h1>
                <LoginForm/>
              </div>
            </div>
            <div className='hidden lg:flex grow-0 shrink-0 basis-90 lg:w-6/12 xl:w-6/12'>
            <img
                src='https://mdbootstrap.com/img/new/ecommerce/vertical/088.jpg'
                alt='Trendy Pants and Shoes'
                className='w-full'
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LoginPage;   