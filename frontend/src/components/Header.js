import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* ✅ Make VQBS a clickable home link */}
        <Link to="/" className="text-2xl font-bold text-green-600 hover:text-green-700 transition duration-200">
          VQBS
        </Link>

        <nav className="flex items-center space-x-6 text-sm font-medium">
          {!isActive('/subjects') && (
            <Link to="/subjects" className={`pb-1 ${isActive('/subjects') ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-600 hover:text-green-500'}`}>
              Subjects
            </Link>
          )}
          {isAuthenticated ? (
            <>
              <Link to="/profile" className={`pb-1 ${isActive('/profile') ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-600 hover:text-green-500'}`}>
                Profile
              </Link>
              <Link to="/reports" className={`pb-1 ${isActive('/reports') ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-600 hover:text-green-500'}`}>
                Reports
              </Link>
              <button
                onClick={logout}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-green-500">Login</Link>
              <Link to="/register" className="text-green-600 hover:underline">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
