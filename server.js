// backend/server.js
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json')),
  storageBucket: 'harassmentreporting-feb29.appspot.com'
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(express.json());

// Admin authentication middleware
function verifyAdmin(req, res, next) {
  const idToken = req.headers.authorization;
  admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      // Check if the email is the admin's email
      if (decodedToken.email === 'principal@cvr.ac.in') {
        next();
      } else {
        res.status(403).send('Unauthorized');
      }
    })
    .catch((error) => {
      res.status(403).send('Unauthorized');
    });
}

// Admin endpoint to get all reports
app.get('/admin/reports', verifyAdmin, async (req, res) => {
  try {
    const reportsSnapshot = await db.collection('reports').get();
    const reports = reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(reports);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Admin endpoint to update report status
app.post('/admin/reports/:id/status', verifyAdmin, async (req, res) => {
  try {
    const reportId = req.params.id;
    const { status } = req.body;
    await db.collection('reports').doc(reportId).update({ status });
    res.send('Status updated');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
