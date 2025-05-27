import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaCaretDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  return (
    <header
      className="text-white shadow-md sticky top-0 z-50 backdrop-blur-md"
      style={{ backgroundColor: '#2ecc71' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Left: Logo + Navigation */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className="text-3xl font-extrabold tracking-wide hover:text-green-100 transition duration-300"
            >
              VQBS
            </Link>
            <Link
              to="/subjects"
              className="text-lg font-medium hover:text-green-100 transition duration-300"
            >
              Subjects
            </Link>
          </div>

          {/* Right: Auth Buttons or Profile Dropdown */}
          <div className="relative flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center text-white hover:text-green-100 font-medium focus:outline-none"
                >
                  <FaUserCircle className="mr-2" size={22} />
                  Profile
                  <FaCaretDown className="ml-1" size={16} />
                </button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-52 bg-white text-gray-800 rounded-xl shadow-lg z-30 overflow-hidden"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-3 hover:bg-gray-100 transition font-medium"
                      >
                        🧑‍💼 My Profile
                      </Link>
                      <Link
                        to="/reports"
                        className="block px-4 py-3 hover:bg-gray-100 transition font-medium"
                      >
                        📊 My Reports
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 transition font-medium"
                      >
                        🚪 Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 font-medium hover:bg-white hover:text-green-700 transition rounded-md border border-white"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 font-medium bg-white text-green-700 hover:bg-green-100 transition rounded-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
