// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Public Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import Unauthorized from "./pages/Unauthorized";

// Dashboard Pages

import ClientDashboardPage from "./pages/dashboard/client/ClientDashboardPage";
import ManagerDashboardPage from "./pages/dashboard/manager/ManagerDashboardPage";
import WaiterDashboardPage from "./pages/dashboard/waiter/WaiterDashboardPage";

// Route Guard
import PrivateRoute from "./lib/auth/PrivateRoute";  // Import from lib/auth
import TableOrderPage from "./pages/dashboard/TableOrderPage";
import TablesPage from "@/pages/dashboard/TablesPage";
import AllOrdersPage from "@/pages/dashboard/AllOrdersPage";
import StaffPage from "./pages/dashboard/manager/StaffPage";
import ChefDashboard from "@/pages/dashboard/chef/ChefDashboard";
import Setting from "./components/shared/dashboard/setting";
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
           <Route path="/dashboard/client/tables" element={<TablesPage />} /> 
          <Route path="/dashboard/client/tables/:id" element={<TableOrderPage />} />
          <Route path="/dashboard/client/settings" element={<Setting />} />
        </Route>

        {/* Private: Manager */}
        <Route element={<PrivateRoute allowedRoles={["manager"]} />}>
           <Route path="/dashboard/manager" element={<ManagerDashboardPage />} />
           <Route path="/dashboard/manager/staff" element={<StaffPage />} />
           <Route path="/dashboard/manager/tables/:id" element={<TableOrderPage />} />
           <Route path="/dashboard/manager/orders" element={<AllOrdersPage />} /> 
           <Route path="/dashboard/manager/settings" element={<Setting />} /> 
        </Route>

        {/* Private: Waiter */}
        <Route element={<PrivateRoute allowedRoles={["waiter"]} />}>
          <Route path="/dashboard/waiter" element={<WaiterDashboardPage />} />
           <Route path="/dashboard/waiter/tables" element={<TablesPage />} /> 
           <Route path="/dashboard/waiter/tables/:id" element={<TableOrderPage />} />
           <Route path="/dashboard/waiter/orders" element={<AllOrdersPage />} /> 
           <Route path="/dashboard/waiter/settings" element={<Setting />} /> 
        </Route>

        {/* Private: Chef */}
        <Route element={<PrivateRoute allowedRoles={["chef"]} />}>
          <Route path="/dashboard/chef" element={<ChefDashboard />} />
          <Route path="/dashboard/chef.settings" element={<Setting />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
