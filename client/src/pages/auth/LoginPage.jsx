import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import LoginForm from '@/components/shared/auth/LoginForm'
import Aside from '@/components/shared/auth/Aside'



const LoginPage = () => {
  return (
    <div className='h-screen md:flex'>
        <Aside/>
        <div className='flex md:w-1/2 h-screen justify-center py-10 items-center bg-white relative'>
            <Link to="/register" className='absolute top-10 right-10'>
                <Button variant="gohst" className="cursor-pointer bg-green-900 text-white">Register</Button>
            </Link>
            <LoginForm/>
        </div>

    </div>
  )
}

export default LoginPage