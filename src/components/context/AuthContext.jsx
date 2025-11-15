import { createContext } from "react";
import { useUser } from "../hooks/useUser";
import Spinner from "../ui/Spinner";

// Create Auth Context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { isLoadingUser, isAuthenticated, user, error } = useUser();

  // if (isLoadingUser) {
  //   return (
  //     <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs">
  //       <Spinner />
  //     </div>
  //   );
  // }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoadingUser, error }}>
      {children}
    </AuthContext.Provider>
  );
};
