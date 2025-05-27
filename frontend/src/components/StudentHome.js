import React from "react";
import welcomeimg from "../assets/welcompage.webp";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function StudentHome() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-50 px-4">
      {/* Left Side: Image */}
      <div className="flex justify-center lg:w-1/2 w-full mb-8 lg:mb-0">
        <img
          src={welcomeimg}
          alt="students studying"
          className="max-w-full h-auto lg:w-3/4"
        />
      </div>

      {/* Right Side: Text and Buttons */}
      <div className="text-center lg:w-1/2 w-full">
        <h1 className="text-4xl font-bold text-[#2ecc71] mb-4">Welcome To VQBS</h1>
        <p className="text-lg text-gray-600 font-semibold mb-8">
          Your Study, Simplified
        </p>

        <div className="flex flex-col items-center space-y-4">
          {/* Link to /subjects */}
          <Link
            to="/subjects"
            className="px-6 py-3 bg-[#2ecc71] text-white rounded-md text-lg font-medium hover:bg-[#0b8c42] transition"
          >
            Let's Start Learning
          </Link>

          {/* Show Sign In button only if user is not logged in */}
          {!isAuthenticated && (
            <Link
              to="/login"
              className="px-6 py-3 bg-[#2ecc71] text-white rounded-md text-lg font-medium hover:bg-[#0b8c42] transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentHome;
