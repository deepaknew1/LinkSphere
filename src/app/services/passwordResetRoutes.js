// passwordResetRoutes.js
const express = require('express');
const crypto = require('crypto');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { getFirestore } = require('firebase-admin/firestore'); 
const { getAuth } = require('firebase-admin/auth'); 
const bcrypt = require('bcryptjs');
const { initializeApp, cert, getApps } = require('firebase-admin/app');
// const serviceAccount = require('../path/to/serviceAccountKey.json');  // Replace with the actual path

const serviceAccount = require('../../app/services/serviceAccountKey.json');  // Replace with the actual path
// E:\linksphereNosql-publish\src\app\services\serviceAccountKey.json

const router = express.Router();

// Initialize Firebase Admin SDK if not already initialized
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();
const auth = getAuth();

// Initialize Firestore and Auth instances
// this.db = getFirestore(this.app);
// this.auth = getAuth(this.app);
// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// ---------- Endpoint 1: Request Password Reset ----------
router.post('/requestPasswordReset', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }
  try {
    // Verify the email exists in Firebase Auth.
    const userRecord = await admin.auth().getUserByEmail(email);
    const userId = userRecord.uid;

    // Generate a secure token (32 bytes hex string)
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 3600 * 1000; // token expires in 1 hour

    // Store the token in a dedicated Firestore collection.
    await db.collection('passwordResetTokens').doc(token).set({
      userId,
      email,
      expiresAt,
    });

    // Configure an email transporter (example using Gmail; adjust as needed)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password', // use environment variables in production!
      },
    });

    // Construct the reset link. Replace 'yourdomain.com' with your domain.
    const resetLink = `https://yourdomain.com/reset-password?token=${token}`;

    // Email options
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Request',
      text: `Hello,\n\nPlease click the following link to reset your password:\n\n${resetLink}\n\nThis link will expire in one hour.\n\nIf you did not request this, please ignore this email.`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password reset email sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ---------- Endpoint 2: Reset Password ----------
router.post('/resetPassword', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and new password are required.' });
  }
  try {
    // Retrieve the token document from Firestore.
    const tokenDoc = await db.collection('passwordResetTokens').doc(token).get();
    if (!tokenDoc.exists) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }
    const tokenData = tokenDoc.data();
    if (Date.now() > tokenData.expiresAt) {
      return res.status(400).json({ error: 'Token expired.' });
    }
    const { userId } = tokenData;

    // Update the user's password in Firebase Auth.
    await admin.auth().updateUser(userId, { password: newPassword });

    // Hash the new password using bcrypt.
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's Firestore document.
    await db.collection('users').doc(userId).update({ password: hashedPassword });

    // Invalidate (delete) the reset token.
    await db.collection('passwordResetTokens').doc(token).delete();

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
