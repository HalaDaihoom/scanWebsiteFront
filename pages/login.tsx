

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router';
// import Cookies from 'js-cookie';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       const response = await axios.post('http://localhost:5000/api/login', {
//         email,
//         password,
//       });

//       const token = response.data.token;
//       Cookies.set('token', token, { expires: 1 });
//       router.push('/userhome');
//     } catch (err: any) {
//       if (axios.isAxiosError(err)) {
//         if (err.response?.status === 400) {
//           setError('Invalid email or password');
//         } else {
//           setError('An unexpected error occurred. Please try again later.');
//         }
//       } else {
//         setError('An unexpected error occurred. Please try again later.');
//         console.error('Unexpected error:', err);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotPassword = () => {
//     router.push('/forgot-password');
//   };

//   return (
//     <div
//       className="flex items-center justify-center min-h-screen bg-cover bg-center"
//       style={{ backgroundImage: "url('/lock-symbol-and-protection-image_15692197.jpg')" }}
//     >
//       <div className="p-8 bg-white bg-opacity-10 shadow-lg backdrop-blur-sm border border-white border-opacity-30 rounded-xl max-w-md w-full">
//         <h1 className="text-center text-black font-bold text-2xl mb-6">Login</h1>

//         <form onSubmit={handleLogin} className="flex flex-col">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
//             disabled={loading}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="p-3 mb-2 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
//             disabled={loading}
//           />

//           {/* Forgot Password Link */}
//           <div className="text-right mb-4">
//             <button
//               type="button"
//               onClick={handleForgotPassword}
//               className="text-sm text-white hover:underline"
//               disabled={loading}
//             >
//               Forgot Password?
//             </button>
//           </div>

//           {/* Login Button with Loader */}
//           <button
//             type="submit"
//             className="p-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center"
//             disabled={loading}
//           >
//             {loading ? (
//               <span className="flex items-center">
//                 <svg
//                   className="animate-spin h-5 w-5 mr-2 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
//                 </svg>
//                 Logging in...
//               </span>
//             ) : (
//               'Login'
//             )}
//           </button>

//           {error && <p className="text-red-500 text-center mt-4">{error}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;









import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        email,
        password,
      });

      const token = response.data.token;
      Cookies.set('token', token, { expires: 1 });
      router.push('/home');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 400) {
          setError('Invalid email or password');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      } else {
        setError('An unexpected error occurred. Please try again later.');
        console.error('Unexpected error:', err);
      }
    }
     finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/lock-symbol-and-protection-image_15692197.jpg')" }}
    >
      <div className="p-8 bg-white bg-opacity-10 shadow-lg backdrop-blur-sm border border-white border-opacity-30 rounded-xl max-w-md w-full">
        <h1 className="text-center text-black font-bold text-2xl mb-6">Login</h1>

        <form onSubmit={handleLogin} className="flex flex-col">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
            disabled={loading}
          />

          {/* Password Input with Toggle */}
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-3 w-full border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black pr-10"
              disabled={loading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700 hover:text-gray-900"
              disabled={loading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right mb-4">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-white hover:underline focus:outline-none"
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="p-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center disabled:opacity-75"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router';
// import Cookies from 'js-cookie';

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null); // Clear previous errors

//     try {
//       const response = await axios.post(`${API_URL}/api/login`, { email, password });
//       const token = response.data.token;
//       Cookies.set('token', token, { expires: 1 }); // Set token in cookies for 1 day
//       router.push('/home'); // Redirect to home page

//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         // Handle known Axios errors
//         if (err.response && err.response.status === 400) {
//           setError('Invalid email or password');
//         } else {
//           setError('An unexpected error occurred. Please try again later.');
//         }
//       } else {
//         // Handle unexpected errors
//         console.error('Unexpected error:', err as Error);
//         setError('An unexpected error occurred. Please try again later.');
//       }
//     }
    
//     // } catch (err: any) {
//     //   if (axios.isAxiosError(err)) {
//     //     // Handle known Axios errors
//     //     if (err.response && err.response.status === 400) {
//     //       setError('Invalid email or password');
//     //     } else {
//     //       setError('An unexpected error occurred. Please try again later.');
//     //     }
//     //   } else {
//     //     // Handle unexpected errors
//     //     console.error('Unexpected error:', err);
//     //     setError('An unexpected error occurred. Please try again later.');
//     //   }
//     // }
//   };

//   return (
//     <div
//       className="flex items-center justify-center min-h-screen bg-cover bg-center"
//       style={{ backgroundImage: "url('/lock-symbol-and-protection-image_15692197.jpg')" }}
//     >
//       <div className="p-8 bg-white bg-opacity-10 shadow-lg backdrop-blur-sm border border-white border-opacity-30 rounded-xl max-w-md w-full">
//         <h1 className="text-center text-black font-bold text-2xl mb-6">Login</h1>
        
//         <form onSubmit={handleLogin} className="flex flex-col">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
//           />
//           <button
//             type="submit"
//             className="p-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
//           >
//             Login
//           </button>
//           {error && <p className="text-red-500 text-center mt-4">{error}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
