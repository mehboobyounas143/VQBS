// src/components/AdminPrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminPrivateRoute = ({ children }) => {
  const { admin } = useAdminAuth();
  return admin ? children : <Navigate to="/admin/login" />;
};

export default AdminPrivateRoute;
