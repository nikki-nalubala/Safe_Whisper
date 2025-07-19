import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../styles/TrackStatus.css';

function TrackStatus() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to view your case.");
        return;
      }

      try {
        const q = query(collection(firestore, 'reports'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const reportsList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log("Fetched report data:", data); // Add this line for logging
          return { id: doc.id, ...data };
        });
        setReports(reportsList);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <h2>Track Your Case</h2>
      {loading ? <p>Loading...</p> : reports.length === 0 ? <p>No cases found.</p> : (
        reports.map(report => (
          <div key={report.id} className="case-card">
            <p><strong>Case ID:</strong> {report.id}</p>
            <p><strong>Description:</strong> {report.description}</p>
            <p><strong>Location:</strong> {report.location}</p>
            <p><strong>Time:</strong> {report.time}</p>
            <p><strong>Date:</strong> {report.date}</p>
            <p><strong>Status:</strong> {report.status}</p>
            {report.punishmentTaken ? (
              <p style={{ color: "red", fontWeight: "bold" }}>
                <strong>Action Taken:</strong> {report.punishmentTaken}
              </p>
            ):(
              <p style={{ color: "red", fontWeight: "bold" }}>
                <strong>Action Taken:</strong> No action taken yet
              </p>
            )}
            <p><strong>Submitted At:</strong> {report.createdAt ? new Date(report.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</p>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default TrackStatus;
