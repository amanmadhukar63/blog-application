import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser({
      fullName: "Aman Madhukar",
      email: "aman@gmail.com"
    });
    setLoading(false);
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
    loading,
    login,
    signup,
    logout
  };
};
