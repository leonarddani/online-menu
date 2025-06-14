import SignupForm from "@/components/shared/auth/SignupForm"
import Aside from "@/components/shared/auth/Aside";
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button'
const SignupPage = () => {
  return (
    <div className="h-screen flex flex-col md:flex-row">
      <Aside/>
                  <Link to="/login" className='absolute top-10 right-10'>
                <Button variant="gohst" className="bg-green-800 hover:bg-emerald-700 text-white">Login</Button>
            </Link>
      <SignupForm />
    </div>
  );
}

export default SignupPage