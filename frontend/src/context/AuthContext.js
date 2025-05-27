import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState(null);

  // Check if the user is logged in from localStorage (or any other persistent store)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedStudent = JSON.parse(localStorage.getItem('student'));

    if (storedToken && storedStudent) {
      setToken(storedToken);
      setStudent(storedStudent);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (token, student) => {
    localStorage.setItem('token', token);
    localStorage.setItem('student', JSON.stringify(student));

    setToken(token);
    setStudent(student);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('student');

    setToken(null);
    setStudent(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, student, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
