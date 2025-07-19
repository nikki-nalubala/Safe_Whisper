// src/components/NavBar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth'; 
import '../styles/NavBar.css';
function NavBar() {
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, [auth]);

  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">Harassment Reporting System</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/report">Report Incident</Link>
        <Link to="/track">Track Report</Link>
        <Link to="/chatbot">Chatbot</Link>
        <Link to="/resources">Resources</Link>
      </div>
      <div className="auth-links">
        {user ? (
          <>
            <span>Welcome, {user.email}</span>
            <button onClick={handleSignOut} className="btn-signout">Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
