import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AdminHomePage.css';

function AdminHomePage() {
  const [reportSummary, setReportSummary] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsCollection = collection(firestore, 'reports');
        const reportsSnapshot = await getDocs(reportsCollection);
        const reportsList = reportsSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(report => report.userId !== auth.currentUser.uid); // Exclude admin's own reports

        // Group reports by description and summarize
        const summary = reportsList.reduce((acc, report) => {
          const existing = acc.find(item => item.description === report.description);
          if (existing) {
            existing.count += 1;
            existing.locations.push(report.location);
            existing.punishmentTaken = report.punishmentTaken; // Add punishment taken field
          } else {
            acc.push({ ...report, count: 1, locations: [report.location] });
          }
          return acc;
        }, []);

        // Determine the mostly occurred place for each description
        summary.forEach(item => {
          const locationCount = item.locations.reduce((acc, location) => {
            acc[location] = (acc[location] || 0) + 1;
            return acc;
          }, {});

          item.mostlyOccurredPlace = Object.keys(locationCount).reduce((a, b) => locationCount[a] > locationCount[b] ? a : b);
        });

        setReportSummary(summary);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const signOut = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="admin-home-container">
      <h2>Admin Home</h2>
      <button className="signout-button" onClick={signOut}>Sign Out</button>
      <div className="nav-links">
        <Link to="/admin" className="btn-primary">Admin Dashboard</Link>
        <Link to="/adminhome" className="btn-primary">Report Status</Link>
      </div>

      <h3>Report Status</h3>
      <table className="report-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Count</th>
            <th>Status</th>
            <th>Most Frequent Location</th>
            <th>Punishment Taken</th> {/* Added Punishment Taken column */}
          </tr>
        </thead>
        <tbody>
          {reportSummary.map((report, index) => (
            <tr key={index}>
              <td>{report.description}</td>
              <td>{report.count}</td>
              <td>{report.status}</td>
              <td>{report.mostlyOccurredPlace}</td> {/* Display mostly occurred place */}
              <td>{report.punishmentTaken || 'No Action taken yet'}</td> {/* Display punishment taken or fallback */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminHomePage;
