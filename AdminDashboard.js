import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { auth, firestore } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [fakeCount, setFakeCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('admin-page');
    return () => {
      document.body.classList.remove('admin-page');
    };
  }, []);

  useEffect(() => {
    const fetchReports = () => {
      const reportsCollection = collection(firestore, 'reports');
      const unsubscribe = onSnapshot(reportsCollection, (snapshot) => {
        const reportsList = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(report => report.userEmail !== 'principal@cvr.ac.in') // Exclude admin's own reports
          .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds); // Sort by timestamp in descending order

        const pending = reportsList.filter(report => report.status === 'Pending').length;
        const resolved = reportsList.filter(report => report.status === 'Resolved').length;
        const fake = reportsList.filter(report => report.status === 'Fake Report').length;

        setReports(reportsList);
        setPendingCount(pending);
        setResolvedCount(resolved);
        setFakeCount(fake);
      }, (error) => {
        console.error("Error fetching reports:", error);
      });

      return () => unsubscribe();
    };

    if (auth.currentUser) {
      fetchReports();
    } else {
      const unsubscribeAuth = auth.onAuthStateChanged(user => {
        if (user) {
          fetchReports();
        }
      });

      return () => unsubscribeAuth();
    }
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const reportDocRef = doc(firestore, 'reports', id);
      await updateDoc(reportDocRef, { status });
      const updatedReports = reports.map(report => report.id === id ? { ...report, status } : report);
      setReports(updatedReports);
      setPendingCount(updatedReports.filter(report => report.status === 'Pending').length);
      setResolvedCount(updatedReports.filter(report => report.status === 'Resolved').length);
      setFakeCount(updatedReports.filter(report => report.status === 'Fake Report').length);
    } catch (error) {
      console.error("Error updating report status:", error);
    }
  };

  const updatePunishment = async (id, punishmentTaken) => {
    try {
      const reportDocRef = doc(firestore, 'reports', id);
      await updateDoc(reportDocRef, { punishmentTaken });
      const updatedReports = reports.map(report => report.id === id ? { ...report, punishmentTaken } : report);
      setReports(updatedReports);
    } catch (error) {
      console.error("Error updating punishment:", error);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <button className="signout-button" onClick={signOut}>Sign Out</button>
      <button className="navigate-button" onClick={() => navigate('/adminhome')}>Go to Home</button>
      <div className="summary">
        <p>Pending Cases: {pendingCount}</p>
        <p>Resolved Cases: {resolvedCount}</p>
        <p>Fake Reports: {fakeCount}</p>
      </div>
      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        reports.map(report => (
          <div key={report.id} className="report-item">
            <p><strong>User ID:</strong> {report.userId}</p> 
            <p><strong>Description:</strong> {report.description}</p>
            <p><strong>Location:</strong> {report.location}</p>
            <p><strong>Time:</strong> {report.time}</p>
            <p><strong>Date:</strong> {report.date}</p>
            <p><strong>Status:</strong> {report.status}</p>
            <p><strong>Punishment Taken:</strong> {report.punishmentTaken || 'Not Available'}</p>
            <p><strong>Submitted At:</strong> {report.createdAt && report.createdAt.seconds ? new Date(report.createdAt.seconds * 1000).toLocaleString() : 'N/A'}</p>

            {/* Display Media Files */}
            {report.files && report.files.length > 0 ? (
              <div className="media-files">
                <h4>Media Files:</h4>
                {report.files.map((fileURL, index) => {
                  const fileExtension = fileURL.split('.').pop().split('?')[0].toLowerCase();
                  if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(fileExtension)) {
                    return (
                      <div key={index} className="media-item">
                        <img src={fileURL} alt={`Evidence ${index + 1}`} className="media-image" />
                      </div>
                    );
                  } else if (['mp4', 'webm', 'ogg'].includes(fileExtension)) {
                    return (
                      <div key={index} className="media-item">
                        <video controls className="media-video">
                          <source src={fileURL} type={`video/${fileExtension}`} />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    );
                  } else if (['mp3', 'wav', 'ogg'].includes(fileExtension)) {
                    return (
                      <div key={index} className="media-item">
                        <audio controls className="media-audio">
                          <source src={fileURL} type={`audio/${fileExtension}`} />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    );
                  } else {
                    return (
                      <div key={index} className="media-item">
                        <a href={fileURL} target="_blank" rel="noopener noreferrer">
                          Download File {index + 1}
                        </a>
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <p>No media files attached.</p>
            )}

            {/* Status Update Buttons */}
            <div className="status-buttons">
              <button onClick={() => updateStatus(report.id, 'Resolved')}>Mark as Resolved</button>
              <button onClick={() => updateStatus(report.id, 'Fake Report')}>Mark as Fake Report</button>
            </div>

            {/* Punishment Section */}
            <div className="punishment-section">
              <input
                type="text"
                placeholder="Enter punishment"
                value={report.punishmentTaken || ''}
                onChange={(e) => {
                  const updatedReports = reports.map(rep =>
                    rep.id === report.id ? { ...rep, punishmentTaken: e.target.value } : rep
                  );
                  setReports(updatedReports);
                }}
              />
              <button onClick={() => updatePunishment(report.id, report.punishmentTaken)}>Save</button>
            </div>
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default AdminDashboard;
