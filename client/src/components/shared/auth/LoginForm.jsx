import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { login } from "@/store/authSlice";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Define schema for form validation using zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
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
      // Sending the POST request to the login API
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        // Handle error if the response is not successful
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to login");
        return;
      }

      // On successful login, retrieve the response data
      const responseData = await response.json();

      // Store the token and user data in localStorage and Redux store
      localStorage.setItem("token", responseData.token);
      localStorage.setItem("user", JSON.stringify(responseData.user));

      // Dispatch login action to Redux store
      dispatch(login(responseData.user));


      // Redirect user based on their role
      const userRole = responseData.user.role;

      if (userRole === "manager") {
        // If the user is a manager, redirect to the manager dashboard
        navigate("/dashboard/manager");
        toast("You are logged in as a Manager.", { description: "Welcome to the Manager Dashboard." });
      } else if (userRole === "waiter") {
        // If the user is a waiter, redirect to the waiter dashboard
        navigate("/dashboard/waiter");
        toast("You are logged in as a Waiter.", { description: "Welcome to the Waiter Dashboard." });
      } else if (userRole === "client") {
        // If the user is a client, redirect to the client dashboard
        navigate("/dashboard/client");
        toast("You are logged in as a Client.", { description: "Welcome to your Client Dashboard." });
      } else if (userRole === "chef") {
        // If the user is a chef, redirect to the chef dashboard
        navigate("/dashboard/chef");
        toast("You are logged in as a Chef.", { description: "Welcome to the Chef Dashboard." });
      } else {
        // Fallback if the user role is unknown
        navigate("/overview");
        toast("Welcome", { description: "You have logged in." });
      }
    } catch (error) {
      // Handle any unexpected errors
      setErrorMessage(error.message || "Something went wrong!");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-96">
        <div className="text-center">
          <h1 className="text-green-900 font-bold text-2xl mb-1">Login</h1>
          <p className="text-s text-green-900 font-normal mb-8">
            Welcome back, please login to continue
          </p>
        </div>

        {/* Email Field */}
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-green-900">Email</FormLabel>
            <FormControl>
              <Input placeholder="you@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Password Field */}
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-green-900">Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="*********" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Display error message if any */}
        {errorMessage && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}

        {/* Submit Button */}
       <Button
  type="submit"
  className="mt-10 cursor-pointer bg-green-800 hover:bg-green-900 text-white w-96"
>
  Submit
</Button>

      </form>
    </Form>
  );
};

export default LoginForm;
