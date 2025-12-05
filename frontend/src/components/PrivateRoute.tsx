// frontend/src/components/PrivateRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

// Function to check if the user is authenticated
const isAuthenticated = () => {
  return !!localStorage.getItem('authToken'); // Check for the token key
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  if (!isAuthenticated()) {
    // If no token exists, redirect them to the login page
    return <Navigate to="/login" replace />;
  }

  // If the token exists, render the protected component (children)
  return <>{children}</>;
};

export default PrivateRoute;