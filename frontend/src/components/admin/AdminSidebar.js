import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaBook,
  FaCogs,
  FaBars,
  FaChartBar,
  FaSignOutAlt,
} from 'react-icons/fa';
import { useAdminAuth } from '../../context/AdminAuthContext';

const menuItems = [
  { label: 'Dashboard', icon: <FaTachometerAlt />, to: '/admin/dashboard' },
  { label: 'Students', icon: <FaUsers />, to: '/admin/students' },
  { label: 'Questions', icon: <FaBook />, to: '/admin/questions' },
  { label: 'Reports', icon: <FaChartBar />, to: '/admin/reports' },
  { label: 'Settings', icon: <FaCogs />, to: '/admin/settings' },
];

const AdminSidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { admin, logoutAdmin } = useAdminAuth();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsSidebarOpen]);

  return (
    <aside
      className={`
        bg-gradient-to-b from-green-600 to-green-800 text-white
        min-h-screen flex flex-col justify-between
        transition-width duration-300 ease-in-out
        ${isSidebarOpen ? 'w-64' : 'w-16'}
        shadow-lg
      `}
    >
      <div>
        <div className="flex items-center p-4 border-b border-green-700">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white p-2 rounded-md hover:bg-green-700 transition"
            aria-label="Toggle sidebar"
          >
            <FaBars size={22} />
          </button>
          {isSidebarOpen && (
            <Link
              to="/admin/dashboard"
              className="ml-3 text-2xl font-extrabold tracking-wider select-none"
            >
              VQBS
            </Link>
          )}
        </div>

        {admin ? (
          <nav className="mt-6">
            <ul>
              {menuItems.map(({ label, icon, to }) => {
                const isActive = location.pathname === to;
                return (
                  <li key={label} className="relative group">
                    <Link
                      to={to}
                      className={`
                        flex items-center gap-3 px-4 py-3
                        hover:bg-green-700 rounded-r-full
                        transition-colors duration-200
                        ${isActive ? 'bg-green-900 font-semibold shadow-lg' : 'font-medium'}
                      `}
                      title={!isSidebarOpen ? label : undefined}
                    >
                      <span className="text-lg">{icon}</span>
                      {isSidebarOpen && <span>{label}</span>}
                    </Link>
                    {/* Tooltip for collapsed sidebar */}
                    {!isSidebarOpen && (
                      <span
                        className="absolute left-full top-1/2 -translate-y-1/2 ml-2
                          w-max whitespace-nowrap rounded bg-green-900 px-2 py-1
                          text-xs font-semibold opacity-0 group-hover:opacity-100
                          transition-opacity pointer-events-none select-none
                          z-50"
                      >
                        {label}
                      </span>
                    )}
                  </li>
                );
              })}

              <li className="mt-6">
                <button
                  onClick={logoutAdmin}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-red-600 rounded-r-full transition-colors duration-200 font-semibold"
                  title={!isSidebarOpen ? 'Logout' : undefined}
                >
                  <FaSignOutAlt className="text-lg" />
                  {isSidebarOpen && <span>Logout</span>}
                </button>
                {!isSidebarOpen && (
                  <span
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-2
                      w-max whitespace-nowrap rounded bg-red-700 px-2 py-1
                      text-xs font-semibold opacity-0 group-hover:opacity-100
                      transition-opacity pointer-events-none select-none
                      z-50"
                  >
                    Logout
                  </span>
                )}
              </li>
            </ul>
          </nav>
        ) : (
          <div className="p-4 text-center text-green-300 italic">
            {isSidebarOpen && 'Please log in to access the admin panel.'}
          </div>
        )}
      </div>

      <footer className="p-4 text-center text-green-100 text-xs select-none">
        &copy; {new Date().getFullYear()} VQBS
      </footer>
    </aside>
  );
};

export default AdminSidebar;
 