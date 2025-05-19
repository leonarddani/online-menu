import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // or `next/router` in Next.js
import { useToast } from "sonner"; // Toast for success/error notifications

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate(); // Using react-router for navigation
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate an API call for login
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store the JWT and role
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", data.role); // Storing the user role
        
        toast.success("Logged in successfully!");

        // Redirect user based on their role
        if (data.role === "admin") {
          navigate("/dashboard/admin");
        } else if (data.role === "manager") {
          navigate("/dashboard/manager");
        } else {
          navigate("/dashboard/staff");
        }
      } else {
        toast.error("Invalid credentials!");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
