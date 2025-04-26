import SignupForm from "@/components/shared/SignupForm"
import Aside from "@/components/Aside";

const SignupPage = () => {
  return (
    <div className="h-screen flex flex-col md:flex-row">
      <Aside/>
      <SignupForm />
    </div>
  );
}

export default SignupPage