import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Profile = () => {
  // State to store user details
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
  });

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
  });

  const [loading, setLoading] = useState(false);

  // Fetch user details when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from localStorage or API
        const storedUser = JSON.parse(localStorage.getItem('student'));
        if (storedUser) {
          setUser(storedUser);
          setFormData({
            firstName: storedUser.firstName || '',
            lastName: storedUser.lastName || '',
            email: storedUser.email || '',
            dateOfBirth: storedUser.dateOfBirth || '', // Ensure it's set to previous value
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here, you would typically send a PUT request to your backend to update the user info
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}api/students/${user._id}`,
        formData
      );

      if (response.data) {
        toast.success('Profile updated successfully!');
        setUser(response.data); // Update the state with the new data
        localStorage.setItem('student', JSON.stringify(response.data));
      }
    } catch (error) {
      toast.error('Error updating profile. Please try again.');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[50%] mx-auto p-8">
      <h2 className="text-3xl font-bold text-center  mb-6">Profile</h2>

      {/* Profile Form */}
      <div className="bg-white shadow rounded-lg p-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                required
                placeholder="Enter your first name"
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                required
                placeholder="Enter your last name"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                required
                placeholder="Enter your email"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''} // Format to YYYY-MM-DD
                onChange={handleChange}
                className="mt-2 block w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                required
              />
            </div>

            {/* Save Button */}
            <div>
              <button
                type="submit"
                className="w-full p-4 bg-[#2ecc71] text-white font-semibold rounded-md hover:bg-[#0b8c42] transition-all duration-300"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
