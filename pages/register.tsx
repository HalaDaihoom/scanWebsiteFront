import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isImageValid, setIsImageValid] = useState(true);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fileType = file.type.split('/')[0];
      if (fileType !== 'image') {
        setError('Please upload a valid image file (JPG, PNG, etc.).');
        setIsImageValid(false);
        setImage(null);
      } else {
        setError(null);
        setIsImageValid(true);
        setImage(file);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        'Password must be at least 8 characters, include one uppercase letter, one lowercase letter, one number, and one special character.'
      );
      return;
    }

    if (!isImageValid) {
      setError('Please upload a valid image before submitting the form.');
      return;
    }

    const formData = new FormData();
    formData.append('FirstName', firstName);
    formData.append('LastName', lastName);
    formData.append('Username', username);
    formData.append('Email', email);
    formData.append('Password', password);
    formData.append('Gender', gender);
    if (image) formData.append('Image', image);

    try {
      const response = await axios.post('http://localhost:5000/api/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.token) {
        Cookies.set('token', response.data.token, { expires: 1 });
        router.push('/login');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      if (axios.isAxiosError(err)) {
        if (!err.response) {
          setError('Network error. Please check your connection.');
        } else if (err.response.status === 404) {
          setError('Registration endpoint not found. Please check the API URL.');
        } else {
          setError(err.response.data?.message || 'Registration failed.');
        }
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/lock-symbol-and-protection-image_15692197.jpg')" }}>
      <div className="p-8 bg-white bg-opacity-10 shadow-lg backdrop-blur-sm border border-white border-opacity-30 rounded-xl max-w-md w-full">
        <h1 className="text-center text-black font-bold text-2xl mb-6">Register</h1>
        <form onSubmit={handleRegister} className="flex flex-col">
          <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black" />
          <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black" />
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black" />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black" />
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black" />

          <label className="text-black mb-2">Gender</label>
          <div className="flex justify-between mb-4">
            <label className="text-black">
              <input type="radio" value="Male" checked={gender === 'Male'} onChange={() => setGender('Male')} required className="mr-2" />
              Male
            </label>
            <label className="text-black">
              <input type="radio" value="Female" checked={gender === 'Female'} onChange={() => setGender('Female')} required className="mr-2" />
              Female
            </label>
          </div>

          <input type="file" onChange={handleImageChange} accept="image/*" className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black" />
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          <button type="submit" className="p-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors" disabled={!isImageValid}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
