// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';

function ProtectedRoute({ children, isAdminRoute }) {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" />;

  if (isAdminRoute && user.email !== 'principal@cvr.ac.in') {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;