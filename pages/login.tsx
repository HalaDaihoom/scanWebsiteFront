

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      const response = await axios.post(`${API_URL}/api/login`, { email, password });
      const token = response.data.token;
      Cookies.set('token', token, { expires: 1 }); // Set token in cookies for 1 day
      router.push('/userhome'); // Redirect to home page

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        // Handle known Axios errors
        if (err.response && err.response.status === 400) {
          setError('Invalid email or password');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      } else {
        // Handle unexpected errors
        console.error('Unexpected error:', err as Error);
        setError('An unexpected error occurred. Please try again later.');
      }
    }
    
    // } catch (err: any) {
    //   if (axios.isAxiosError(err)) {
    //     // Handle known Axios errors
    //     if (err.response && err.response.status === 400) {
    //       setError('Invalid email or password');
    //     } else {
    //       setError('An unexpected error occurred. Please try again later.');
    //     }
    //   } else {
    //     // Handle unexpected errors
    //     console.error('Unexpected error:', err);
    //     setError('An unexpected error occurred. Please try again later.');
    //   }
    // }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/lock-symbol-and-protection-image_15692197.jpg')" }}
    >
      <div className="p-8 bg-white bg-opacity-10 shadow-lg backdrop-blur-sm border border-white border-opacity-30 rounded-xl max-w-md w-full">
        <h1 className="text-center text-black font-bold text-2xl mb-6">Login</h1>
        
        <form onSubmit={handleLogin} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
          />
          <button
            type="submit"
            className="p-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
          >
            Login
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;
