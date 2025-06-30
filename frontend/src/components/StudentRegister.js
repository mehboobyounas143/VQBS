import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Importing toast for notifications
import { useNavigate, Link } from 'react-router-dom'; // Importing useNavigate and Link for redirect and navigation
import { useAuth } from '../context/AuthContext'; // Importing useAuth hook to check authentication status

const StudentRegister = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    password: ''
  });

  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { isAuthenticated } = useAuth(); // Get isAuthenticated from the context

  // Redirect if the user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile'); // Redirect to profile page if the user is already logged in
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true while making the request

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}api/students`,
        formData
      );

      console.log('API Response:', response);

      if (response && response.data) {
        toast.success('Registration successful!');
        setTimeout(() => {
          navigate('/login'); // Redirect to login after successful registration
        }, 1500);
      } else {
        throw new Error('Response data is undefined');
      }
    } catch (error) {
      console.error('Error during registration:', error);

      if (error.response) {
        toast.error(error.response.data.error || 'Error during registration. Please try again.');
      } else if (error.request) {
        toast.error('No response from server. Please check your network connection.');
      } else {
        toast.error(error.message || 'An unexpected error occurred.');
      }
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold text-center mb-4">Student Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-[#2ecc71] text-white font-semibold rounded-md hover:bg-[#0B8C42]"
          disabled={loading} // Disable button while loading
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#2ecc71] hover:underline">
            Login Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StudentRegister;
