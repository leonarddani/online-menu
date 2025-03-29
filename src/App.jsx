import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";

function App() {
  return (
   <Router>
     <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/auth/login" element={<LoginPage/>}/>
      
      {/* private routes */}
     </Routes>
   </Router>
  );
}

export default App;