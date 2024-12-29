import React, { createContext, useState, ReactNode, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (status: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);

  async function checkUserInfo(): Promise<boolean> {
    try {
      const user = await axiosInstance.get("/users/me");
      console.log(user?.data.data);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  useEffect(() => {
    const fetchUserInfo = async () => {
      const isAuth = await checkUserInfo();
      setAuthenticated(isAuth);
    };

    fetchUserInfo();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
