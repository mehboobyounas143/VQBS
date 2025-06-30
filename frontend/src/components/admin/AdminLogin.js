import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginAdmin, admin } = useAdminAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (admin) {
      navigate('/admin/dashboard');
    }
  }, [admin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}api/admins/login`,
        formData
      );

      console.log(response.data);

      if (response && response.data && response.data.token && response.data.admin) {
        toast.success('Login successful!');
        loginAdmin(response.data.admin); // Update the global admin auth state
        navigate('/admin/dashboard'); // Navigate to the admin dashboard after login
      } else {
        toast.error('Unexpected response structure.');
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error || 'Invalid credentials. Please try again.');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-[#2d2d2d] via-[#000000] to-[#434343]">
      <div className="w-[35%] mx-auto p-8 bg-[#1e1e1e] shadow-2xl rounded-lg sm:p-6 md:p-8 transform transition-all hover:scale-105">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">Admin Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 block w-full p-3 border border-gray-600 rounded-md focus:ring-2 focus:ring-[#ff6a00] transition-all bg-[#2d2d2d] text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 block w-full p-3 border border-gray-600 rounded-md focus:ring-2 focus:ring-[#ff6a00] transition-all bg-[#2d2d2d] text-white placeholder-gray-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-[#900c3f] text-white font-semibold rounded-md hover:bg-[#700a31] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
