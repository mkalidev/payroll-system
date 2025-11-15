// components/ProtectedRoute.jsx

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./components/hooks/auth";

const ProtectedRoute = ({ redirectTo = "/login" }) => {
  const { isAuthenticated, error } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  // if (isLoadingUser) {
  //   return (
  //     <div className="w-full h-screen flex items-center justify-center">
  //       <div className="flex flex-col items-center space-y-4">
  //         <img
  //           src="/loading.svg"
  //           alt="Loading"
  //           className="animate-pulse w-16"
  //         />
  //         <Spinner className="text-blue-500" />
  //         {/* <p className="text-gray-600">Checking authentication...</p> */}
  //       </div>
  //     </div>
  //   );
  // }

  // If user is not authenticated, redirect to login with the current location
  if (!isAuthenticated || isAuthenticated === undefined || error) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  // if (!user?.isEmailVerified) {
  //   return <Navigate to={"verify-email"} state={{ from: location }} replace />;
  // }

  // If user is authenticated, render the protected component
  return <Outlet />;
};

export default ProtectedRoute;
