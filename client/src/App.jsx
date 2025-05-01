import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import { Toaster } from "./components/ui/sonner";
import Cheflanding from "./pages/dashboard/chef/Cheflanding";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/overview" element={<Cheflanding />} />
        {/* private routes */}
      </Routes>
      <Toaster/>
    </Router>
  );
}

export default App;