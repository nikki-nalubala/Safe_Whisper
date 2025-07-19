import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import '../styles/ReportIncident.css';

function ReportIncident() {
    const [description, setDescription] = useState('');
    const [files, setFiles] = useState([]);
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('report-incident-page');
        return () => {
            document.body.classList.remove('report-incident-page');
        };
    }, []);

    // Define handleFileChange
    const handleFileChange = (e) => {
        setFiles([...e.target.files]);
    };

    const handleSubmit = async () => {
        if (!auth.currentUser) {
            alert("You must be logged in to submit a report.");
            return;
        }

        try {
            const userId = auth.currentUser.uid;
            const reportData = {
                description,
                status: 'Pending',
                createdAt: Timestamp.now(),
                userId: userId,
                anonymous: true,
                location,
                date,
                time,
                files: [], // You may need to handle files separately if uploading
                punishmentTaken: '',
                action: '',
            };

            // Add report to Firestore
            const reportRef = await addDoc(collection(firestore, 'reports'), reportData);

            // Handle file uploads here if needed

            alert('Thanks for submitting the report. We will ensure to take prompt and effective action to address your concerns. Your safety and confidentiality are our top priorities.');

            // Reset form fields
            setDescription('');
            setFiles([]);
            setLocation('');
            setDate('');
            setTime('');
            setSubmitted(true);

            console.log("Redirecting to '/' in 2 seconds...");

            // Redirect to home page after 2 seconds
            setTimeout(() => {
                console.log("Redirecting now...");
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error("Error submitting report:", error);
            alert(`Error submitting report: ${error.message}`);
        }
    };

    return (
        <div className="report-incident-container">
            <h2>Report Incident</h2>
            {submitted ? (
                <p className="success-message">
                    Thanks for submitting the report. We will ensure to take prompt and effective action to address your concerns. Your safety and confidentiality are our top priorities.
                </p>
            ) : (
                <form>
                    <textarea
                        placeholder="Describe the incident"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea><br />
                    <input
                        type="text"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                    /><br />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    /><br />
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    /><br />
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*,audio/*"
                        onChange={handleFileChange}
                    /><br />
                    <button type="button" onClick={handleSubmit}>Submit Report</button>
                </form>
            )}
        </div>
    );
}

export default ReportIncident;
