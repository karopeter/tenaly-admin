"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '@/services/api';

interface User { 
 id: string;
 fullName: string;
 email: string;
 phoneNumber?: string;
 role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;

}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();


    useEffect(() => {
     const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('admin');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
         setIsLoading(true);

         const response = await api.post("/auth/login", {
            login: email,
            password: password
         });

         const data = response.data;

         if (data.user.role !== "admin") {
            throw new Error("Access denied: Admins only");
         }

         // Store in localStorage 
        localStorage.setItem("token", data.token);
         localStorage.setItem("admin", JSON.stringify(data.user));

         setToken(data.token);
         setUser(data.user);
         
         toast.success("Login successful! Welcome back.");
         router.push("/dashboard");
        } catch (error: any) {
          toast.error(error?.response?.data?.message || error.message || "Login failed.");
          throw error;
        } finally {
         setIsLoading(false);
        }
    };

    const logout = () => {
    localStorage.removeItem("token");
      localStorage.removeItem("admin");

      setToken(null);
      setUser(null);

      toast.info("You have been logged out.");
      router.push("/");
    };

    return (
     <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
        {children}
     </AuthContext.Provider>
    );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used withtin an AuthProvider");
  }

  return context;
}