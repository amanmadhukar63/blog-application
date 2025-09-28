import React, { createContext, useEffect, useContext, useState } from "react";
import { getLocalStorage } from "../utils/helpers.js";

const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getLocalStorage('user');
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    if(user) setIsAuthenticated(true);
    else setIsAuthenticated(false);
    setLoading(false);
  }, [user]);

  return (
    <GlobalContext.Provider
      value={{ user, setUser, isAuthenticated, theme, setTheme, loading }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
