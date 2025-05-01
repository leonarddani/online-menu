import { useState } from "react";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button"
import { login } from "@/store/authSlice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner";

const formSchema = z.object({
    email: z.string().email({message: "Please enter a valid email address."}),
    password: z.string().min(6,{message: "Password must be at least 6 characters."})
    });

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState(null);
    const form = useForm({
        resolver: zodResolver(formSchema),
        
    });
    
    const onSubmit = async (values) => {

        try {
          const response = await fetch("http://localhost:8095/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            setErrorMessage(errorData.message || "Failed to login");
            return; // dil që këtu nëse ka error
          }
         const responseData = await response.json();

        localStorage.setItem("token", responseData.token);
        localStorage.setItem("user", JSON.stringify (responseData.user));
         
        dispatch(login(responseData.user));
        toast("welcome back",{description: "you have been loged in sucesfuly"});
        navigate("/overview");
        } catch (error) {
          setErrorMessage(error.message || "Something went wrong!");

        }
      };

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-96">
            <div className='text-center'>
                <h1 className=' text-green-900 font-bold text-2xl mb-1'>
                    Login
                </h1>
                <p className='text-s text-green-900 font-normal mb-8'>Welcome back, please login to continue</p>
            </div>
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-green-900">Email</FormLabel>
                <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormLabel className="text-green-900">Password</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="*********" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
              {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}
            <Button type="submit" className="bg-green-900 cursor-pointer text-white" >Submit</Button>
        </form>
        </Form>
  )
}

export default LoginForm