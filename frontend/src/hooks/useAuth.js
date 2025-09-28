import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser({
      fullName: "Aman Madhukar",
      email: "aman@gmail.com"
    });
  }, []);

  const login = async (email, password) => {
    
  };

  const signup = async (fullName, email, password) => {
    
  };

  const logout = () => {
    
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout
  };
};
