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
  const [isImageValid, setIsImageValid] = useState(true); // Track whether the image is valid
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fileType = file.type.split('/')[0]; // Get the MIME type's main type (image/video/audio, etc.)

      if (fileType !== 'image') {
        setError('Please upload a valid image file (JPG, PNG, etc.).');
        setIsImageValid(false); // Mark as invalid image
        setImage(null); // Clear the image if it's not valid
      } else {
        setError(null); // Clear any previous error
        setIsImageValid(true); // Mark as valid image
        setImage(file); // Store the image file
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Check password strength (at least 8 characters, one uppercase, one lowercase, one digit, one special character)
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must meet the following requirements: Minimum 8 characters, at least one uppercase letter, one lowercase letter, one digit, and one special character.');
      return;
    }

    if (!isImageValid) {
      // Prevent registration if image is invalid
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
    if (image) formData.append('Image', image); // Include the image file if it exists

    try {
      const response = await axios.post('http://localhost:5000/api/Home/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.token) {
        Cookies.set('token', response.data.token, { expires: 1 });
        router.push('/login');  // Redirect to login page
      }
    } catch (err) {
      console.error('Registration failed:', err);
      // Error handling
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || 'Registration failed';
        if (errorMessage.includes('Password')) {
          setError('Password must meet the following requirements: Minimum 8 characters, at least one uppercase letter, one lowercase letter, one digit, and one special character.');
        } else {
          setError(errorMessage);
        }
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/lock-symbol-and-protection-image_15692197.jpg')" }}>
      <div className="p-8 bg-white bg-opacity-10 shadow-lg backdrop-blur-sm border border-white border-opacity-30 rounded-xl max-w-md w-full">
        <h1 className="text-center text-black font-bold text-2xl mb-6">Register</h1>
        <form onSubmit={handleRegister} className="flex flex-col">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
          />
          
          {/* Gender Section */}
          <label className="text-black mb-2">Gender</label>
          <div className="flex justify-between mb-4">
            <label className="text-black">
              <input
                type="radio"
                value="Male"
                checked={gender === 'Male'}
                onChange={() => setGender('Male')}
                required
                className="mr-2"
              />
              Male
            </label>
            <label className="text-black">
              <input
                type="radio"
                value="Female"
                checked={gender === 'Female'}
                onChange={() => setGender('Female')}
                required
                className="mr-2"
              />
              Female
            </label>
          </div>

          {/* Image upload */}
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
          />
          {error && error.includes('Please upload a valid image file') && (
            <p className="text-red-500 text-center mt-4">{error}</p>
          )}

          {/* Register button */}
          <button
            type="submit"
            className="p-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
            disabled={!isImageValid}  // Disable the button if the image is not valid
          >
            Register
          </button>
          {error && !error.includes('Please upload a valid image file') && (
            <p className="text-red-500 text-center mt-4">{error}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
