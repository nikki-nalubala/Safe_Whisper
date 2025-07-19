// src/pages/Register.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { Link } from 'react-router-dom'; 
import '../styles/Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('register-page');
    return () => {
      document.body.classList.remove('register-page');
    };
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!email.endsWith('@cvr.ac.in')) {
      alert('Please use your college email (@cvr.ac.in) to sign up.');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data in Realtime Database
      await set(ref(db, 'users/' + user.uid), {
        email: user.email,
        uid: user.uid,
      });

      alert('Account created successfully!');
      navigate('/reportIncident'); // Navigate to the ReportIncident page
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="register-container">
      <h2>College Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="College Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br/>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br/>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
