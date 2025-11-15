import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import AppLayout from "./components/layouts/AppLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Workspace from "./pages/Workspace";
import SingleWorkspace from "./pages/SingleWorkspace";
import CreatePayroll from "./pages/CreatePayroll";
import { useEffect, useState } from "react";
import AuthLayout from "./components/layouts/AuthLayout";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import ProtectedRoute from "./ProtectedRoute";
import AcceptAdmin from "./pages/AcceptAdmin";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import Subscriptions from "./pages/Subscriptions";
import Jobs from "./pages/Jobs";
import InvoicePage from "./pages/InvoicePage";

function App() {
  const NavigationLoader = () => {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 1000);
      return () => clearTimeout(timer);
    }, [location.pathname]);

    if (isLoading) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-c-bg backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <BrowserRouter>
        {/* <NavigationLoader /> */}
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/workspace" element={<Workspace />} />
              <Route path="/workspace/:slug" element={<SingleWorkspace />} />
              <Route
                path="/workspace/:slug/:id"
                element={<SingleWorkspace />}
              />
              <Route
                path="/workspace/:slug/:id/invoice"
                element={<InvoicePage />}
              />
              <Route
                path="/workspace/:slug/payroll/create"
                element={<CreatePayroll />}
              />
              <Route path="/settings" element={<Settings />} />
              <Route path="/subscription" element={<Subscriptions />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/:id" element={<h1>Dynamic Route</h1>} />
            </Route>
          </Route>
          <Route path="*" element={<h1>404 Not Found</h1>} />
          <Route path="/reset-password/" element={<ResetPassword />} />
          <Route path="/accept-admin" element={<AcceptAdmin />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
