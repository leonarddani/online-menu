// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Public Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Unauthorized from "./pages/Unauthorized";

// Dashboard Pages
import Cheflanding from "./pages/dashboard/chef/Cheflanding";
import ClientDashboardPage from "./pages/dashboard/client/ClientDashboardPage";
import ManagerDashboardPage from "./pages/dashboard/manager/ManagerDashboardPage";
import WaiterDashboardPage from "./pages/dashboard/waiter/WaiterDashboardPage";

// Route Guard
import PrivateRoute from "./lib/auth/PrivateRoute";  // Import from lib/auth
import TableOrderPage from "./components/shared/dashboard/waiter/TableOrderPage";
import TablesPage from "./components/shared/dashboard/Tables";
import AllOrdersPage from "@/pages/dashboard/waiter/AllOrdersPage";
// import TablesPage from "./pages/dashboard/waiter/TablesPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Private: Client */}
        <Route element={<PrivateRoute allowedRoles={["client"]} />}>
          <Route path="/dashboard/client" element={<ClientDashboardPage />} />
          
        </Route>

        {/* Private: Manager */}
        <Route element={<PrivateRoute allowedRoles={["manager"]} />}>
           <Route path="/dashboard/manager" element={<ManagerDashboardPage />} />
           <Route path="/dashboard/manager/staff" element={<ManagerDashboardPage />} />
         
        </Route>

        {/* Private: Waiter */}
        <Route element={<PrivateRoute allowedRoles={["waiter"]} />}>
          <Route path="/dashboard/waiter" element={<WaiterDashboardPage />} />
          <Route path="/dashboard/waiter/tables/:id" element={<TableOrderPage />} />
           <Route path="/dashboard/waiter/tables" element={<TablesPage />} /> 
           <Route path="/dashboard/waiter/orders" element={<AllOrdersPage />} /> 
        </Route>

        {/* Private: Chef */}
        <Route element={<PrivateRoute allowedRoles={["chef"]} />}>
          <Route path="/dashboard/chef" element={<Cheflanding />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
