import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight , Lightbulb} from "lucide-react"
import imgLanding from "@/assets/img/img-landing1.avif";
import landingImg from "@/assets/img/img-landing2.avif";
import imglan  from "@/assets/img/img-landing3.avif";
import lanimg  from "@/assets/img/img-landing4.avif";
import Navbar from '@/components/shared/navbar/Navbar';
import Sidebar from '@/components/shared/navbar/SideBar';

import TableOrderPage from '@/components/shared/dashboard/waiter/TableOrderPage';


export const LandingPage = () => {
  return (
         
   
    <main className="pt-20 bg-green-900 h-screen">
          <Navbar/>
    <div className='px-12 mx-auto max-w-7xl'>
        <div className='w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center'>
            <h1 className='mb-8 font-bold leading-none tracking-normal text-slate-800 md:text-6xl text-4xl md:tracking-tight'>
                <h1 className='text-transparent bg-clip-text  bg-gradient-to-r from-yellow-700 to-yellow-300  md:text-8xl'>Moxxa Coffee</h1>
                <h3 className='text-transparent bg-clip-text  bg-gradient-to-r from-yellow-700 to-yellow-300  md:text-4xl'>Good Coffee | Good Food</h3>
            </h1>
            <div className='mb-4 space-x-0 md:space-x-2 md:mb-8'>
                <Button className="bg-white text-green-900 hover:bg-gray-300" asChild>
                <Link to="/login">
                Get Started <ArrowRight />
                </Link>
                </Button>
                <Button className=" bg-white text-green-900 hover:bg-gray-300" asChild>
                <Link to="/register">
                Sign Up <Lightbulb />
                </Link>
                </Button>
            </div>
        </div>
        <div className=' flex gap-6'>
        <img src ={imglan} alt="Landing" className='w-70 h-90 mt-10 rounded-lg shadow-lg' />
        <img src ={landingImg} alt="Landing" className='w-70 h-90 mt-10 rounded-lg shadow-lg' />
        <img src ={imgLanding} alt="Landing" className='w-70 h-90 mt-10 rounded-lg shadow-lg' />
        <img src ={lanimg} alt="Landing" className='w-70 h-90 mt-10 rounded-lg shadow-lg' />
        </div>
       <Sidebar role={"manager"}/>
       <TableOrderPage/>
    </div>
    
</main>               
  )
}


export default LandingPage