"use client";

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Img from '../reusables/Img';
import { Eye,  EyeOff, Lock, Mail  } from 'lucide-react';

const AuthComponent: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login, isLoading } = useAuth();


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            return;
        }

        try {
         await login(email, password);
        } catch (error) {
         console.error('Login error:', error);
        }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E5EEFC] px-4">
        <div className="max-w-md w-full bg-white rounded-[12px] shadow-xl p-8">
          <div className="text-center mb-8">
            <Img src="/admin-logo.svg" width={130.83} height={64} className="mx-auto mb-4" />
            <h1 className="text-[#525252] font-[500] text-[24px] mb-2">Admin Login</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
             <span className="block text-[14px] font-[600] text-[#525252] mb-2">
              Email Address
            </span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
               id="email"
               type="email"
               onChange={(e) => setEmail(e.target.value)}
               className="block w-full pl-10 pr-3 py-3 border-[1px] border-[#CDCDD7] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
               placeholder="admin@tenaly.com"
               required
              />
            </div>
            </div>

            <div>
             <span  className='block text-[14px] font-[600] text-[#525252] mb-2'>
               Password
            </span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
               id="password"
               type={showPassword ? 'text' : 'password'}
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               className="block w-full pl-10 pr-12 py-3  border-[1px] border-[#CDCDD7] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
               placeholder="Enter your password"
               required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
               {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
               ): (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
               )}
              </button>
            </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#00A8DF] to-[#1031AA]  text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 
              focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
             {isLoading ? (
              <span className="flex items-center justify-center">
                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loggin in...
              </span>
             ): (
                'Login'
             )}
            </button>
          </form>

          <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Tenaly Admin Panel © {new Date().getFullYear()}
          </p>
          </div>
        </div>
      </div>
    );
}

export default AuthComponent;