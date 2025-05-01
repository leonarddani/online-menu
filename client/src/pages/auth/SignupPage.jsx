import SignupForm from "@/components/shared/auth/SignupForm"
import Aside from "@/components/shared/auth/Aside";

const SignupPage = () => {
  return (
    <div className="h-screen flex flex-col md:flex-row">
      <Aside/>
      <SignupForm />
    </div>
  );
}

export default SignupPage