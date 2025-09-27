// const { onRequest } = require('firebase-functions/v2/https');
// const admin = require("firebase-admin");
// const nodemailer = require("nodemailer");
// const { google } = require('google-auth-library');
// const bcrypt = require("bcryptjs");
// const express = require('express');

// const functions = require('firebase-functions');
// admin.initializeApp();

// // Log the production Gmail config for debugging (remove this in production)
// console.log("Gmail config from functions.config():", functions.config().gmail);

// const app = express();
// app.use(express.json());

// // Health check endpoint (required by Cloud Run)
// app.get('/', (req, res) => {
//   console.log("Health check hit. PORT =", process.env.PORT);
//   res.status(200).send('OK');
// });

// // CORS middleware
// app.use((req, res, next) => {
//   res.set('Access-Control-Allow-Origin', '*');
//   res.set('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

// // Password reset endpoint (POST)
// app.post('/', async (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).send('Email is required');

//   console.log("Received POST for email:", email);
//   console.log("Using Gmail config:", functions.config().gmail);

//   try {
//     // OAuth2 setup using functions.config()
//     const oauth2Client = new google.auth.OAuth2(
//       functions.config().gmail.client_id,
//       functions.config().gmail.client_secret,
//       "https://developers.google.com/oauthplayground" // or your actual redirect URI if needed
//     );
//     oauth2Client.setCredentials({
//       refresh_token: functions.config().gmail.refresh_token
//     });

//     const tokenResponse = await oauth2Client.getAccessToken();
//     console.log("Token response:", tokenResponse);

//     // Handle the possibility that tokenResponse might be a string
//     const accessToken =
//       (typeof tokenResponse === 'object' && tokenResponse.token)
//         ? tokenResponse.token
//         : tokenResponse;
//     if (!accessToken) {
//       throw new Error("Failed to obtain access token");
//     }
//     console.log("Access token obtained:", accessToken);

//     // Configure transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         type: "OAuth2",
//         user: functions.config().gmail.user,
//         clientId: functions.config().gmail.client_id,
//         clientSecret: functions.config().gmail.client_secret,
//         refreshToken: functions.config().gmail.refresh_token,
//         accessToken: accessToken,
//       }
//     });

//     // Generate a new 9-digit password
//     const newPassword = Math.floor(100000000 + Math.random() * 900000000).toString();
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // Update Firestore: Find user by email
//     const usersRef = admin.firestore().collection("users");
//     const snapshot = await usersRef.where("emailOrMobile", "==", email).get();
//     if (snapshot.empty) return res.status(404).json({ error: "User not found" });

//     // Update matching documents
//     const batch = admin.firestore().batch();
//     snapshot.forEach(doc => batch.update(doc.ref, { password: hashedPassword }));
//     await batch.commit();

//     // Send email with the new password
//     await transporter.sendMail({
//       from: `"Password Service" <${functions.config().gmail.user}>`,
//       to: email,
//       subject: "New Password",
//       text: `Your new password is: ${newPassword}`,
//     });

//     console.log("Password reset email sent successfully.");
//     return res.json({ success: true });
//   } catch (error) {
//     console.error("Error in handlePasswordReset:", error);
//     return res.status(500).json({ error: error.message });
//   }
// });

// // Export as Cloud Run-enabled function; do not call app.listen() explicitly.
// exports.handlePasswordReset = onRequest(
//   { 
//     timeoutSeconds: 540,
//     memory: '256MB',
//     invoker: 'public'
//   },
//   app
// );
