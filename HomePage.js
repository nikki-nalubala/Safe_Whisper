// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../styles/HomePage.css';

function HomePage() {
  return (
    <div className="homepage">
      <NavBar />
      <header className="hero-section">
        <div className="hero-text">
          <h1>HARASSMENT REPORT</h1>
          <p style={{ marginBottom: '40px' }}>Your voice matters. Report incidents safely and confidentially.</p>
          <Link to="/report" className="btn-primary">Report an Incident</Link>
        </div> 
      </header>

      <main className="features-section">
        <h2>SERVICES</h2>
        <div className="features-grid">
          <div className="feature-card">
            <img src="assets/tracking.png" alt="Track Report" />
            <h3>Track Report</h3>
            <p>Stay updated on the status of your reports.</p>
            <Link to="/track" className="btn-secondary">Learn More</Link>
          </div>

          <div className="feature-card">
            <img src="assets/report-incident.png" alt="Report Incident" />
            <h3>Report Incident</h3>
            <p>File a new report securely and confidentially.</p>
            <Link to="/report" className="btn-secondary">Report Now</Link>
          </div>

          <div className="feature-card">
            <img src="assets/chatbot.png" alt="Chatbot" />
            <h3>Support Chatbot</h3>
            <p>Get immediate assistance and resources.</p>
            <button className="btn-secondary">Chat Now</button>
          </div>

          <div className="feature-card">
            <img src="assets/resources.png" alt="Resources" />
            <h3>Resources</h3>
            <p>Access helpful information and support networks.</p>
            <Link to="/resources" className="btn-secondary">Explore</Link>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Harassment Reporting System. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;
