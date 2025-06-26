import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check token existence in localStorage
    /* bcoz
     When You Restart or Reload Your App:
The entire React component tree is remounted.

That includes the <AuthProvider>, so its useEffect runs once at that moment.

It checks localStorage for a token and updates isLoggedIn accordingly. */
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true if token exists
  }, []);

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    //here children means ur entire app
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}> 
      {children} 
    </AuthContext.Provider>
  );
};

// Hook to use auth
export const useAuth = () => useContext(AuthContext);
