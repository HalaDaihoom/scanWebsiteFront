import React, { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Layout from './Layout'; // Ensure this matches the file name

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProfileData {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  gender: string;
  image: string | null;
}

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    gender: '',
    image: null as File | null,
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmNewPassword: '',
  });
  const [imageError, setImageError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    } else {
      axios
        .get(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setProfile(response.data);
          setFormData({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            username: response.data.userName,
            email: response.data.email,
            gender: response.data.gender || '',
            image: null,
          });
        })
        .catch((error: unknown) => {
          console.error('Error fetching profile:', error);
          if (error instanceof AxiosError && error.response?.status === 401) {
            router.push('/login');
          } else {
            setImageError('Failed to load profile data.');
          }
        });
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const fileType = file.type.split('/')[0];
      if (fileType !== 'image') {
        setImageError('Please upload a valid image file (JPG, PNG, etc.).');
        setFormData({ ...formData, image: null });
      } else {
        setImageError(null);
        setFormData({ ...formData, image: file });
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = Cookies.get('token');
    if (!token) {
      setImageError('No authentication token found.');
      return;
    }

    setImageError(null);
    setPasswordError(null);

    // Handle profile update
    const formDataToSend = new FormData();
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('gender', formData.gender);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }

    try {
      await axios.post(`${API_URL}/api/profile`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error: unknown) {
      console.error('Error updating profile:', error);
      setImageError('Failed to update profile.');
      return;
    }

    // Handle password change if fields are filled
    if (passwordData.newPassword && passwordData.confirmNewPassword) {
      // Client-side password validation
      if (passwordData.newPassword !== passwordData.confirmNewPassword) {
        setPasswordError('New passwords do not match!');
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(passwordData.newPassword)) {
        setPasswordError(
          'Password must be at least 8 characters, include one uppercase letter, one lowercase letter, one number, and one special character.'
        );
        return;
      }

      try {
        await axios.post(
          `${API_URL}/api/profile/password`,
          {
            password: passwordData.newPassword,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPasswordData({
          newPassword: '',
          confirmNewPassword: '',
        });
      } catch (error: unknown) {
        console.error('Error updating password:', error);
        if (error instanceof AxiosError && error.response) {
          const status = error.response.status;
          const errorData = error.response.data;
          console.log('Error response data:', errorData); // Debug log
          if (status === 400 && errorData?.message) {
            setPasswordError(errorData.message);
          } else if (status === 401) {
            setPasswordError('Unauthorized. Please log in again.');
            router.push('/login');
          } else {
            setPasswordError('Failed to update password. Please try again.');
          }
        } else {
          setPasswordError('An unexpected error occurred while updating password.');
        }
        return;
      }
    }

    // Refresh profile data if no errors
    try {
      const response = await axios.get(`${API_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
      setFormData({
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        username: response.data.userName,
        email: response.data.email,
        gender: response.data.gender || '',
        image: null,
      });
      setIsEditing(false);
    } catch (error: unknown) {
      console.error('Error fetching profile:', error);
      setImageError('Failed to refresh profile data.');
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/lock-symbol-and-protection-image_15692197.jpg')" }}>
        <div className="p-8 bg-white bg-opacity-10 shadow-lg backdrop-blur-sm border border-white border-opacity-30 rounded-xl max-w-md w-full">
          <h1 className="text-center text-black font-bold text-2xl mb-6">My Profile</h1>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
                />
              </div>
              <div>
                <label className="text-black mb-2 block">Gender</label>
                <div className="flex justify-between">
                  <label className="text-black">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === 'Male'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Male
                  </label>
                  <label className="text-black">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === 'Female'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Female
                  </label>
                </div>
              </div>
              <div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full p-3 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
                />
                {imageError && <p className="text-red-500 text-center">{imageError}</p>}
              </div>
              <h2 className="text-center text-black font-bold text-xl mb-4">Change Password (Optional)</h2>
              <div>
                <input
                  type="password"
                  placeholder="New Password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className="w-full p-3 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
                />
                {passwordError && <p className="text-red-500 text-center">{passwordError}</p>}
              </div>
              <button
                type="submit"
                className="p-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <img
                src={profile.image || '/default-avatar.png'}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <p className="text-black"><strong>First Name:</strong> {profile.firstName}</p>
              <p className="text-black"><strong>Last Name:</strong> {profile.lastName}</p>
              <p className="text-black"><strong>Username:</strong> {profile.userName}</p>
              <p className="text-black"><strong>Email:</strong> {profile.email}</p>
              <p className="text-black"><strong>Gender:</strong> {profile.gender || 'Not specified'}</p>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full p-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;