// const admin = require('firebase-admin');
// const nodemailer = require('nodemailer');
// const bcrypt = require('bcryptjs');

// // Firebase initialization
// admin.initializeApp();

// // Set up email service (using NodeMailer)
// const transporter = nodemailer.createTransport({
//   service: 'gmail', // You can use other services like SendGrid
//   auth: {
//     user: 'your-email@gmail.com',
//     pass: 'your-email-password',
//   },
// });

// // Function to send the email
// const sendPasswordEmail = (email, password) => {
//   const mailOptions = {
//     from: 'your-email@gmail.com',
//     to: email,
//     subject: 'Your New Password',
//     text: `Here is your new password: ${password}`,
//   };

//   transporter.sendMail(mailOptions, (err, info) => {
//     if (err) {
//       console.error('Error sending email: ', err);
//     } else {
//       console.log('Email sent: ', info.response);
//     }
//   });
// };

// // Forgot password endpoint
// const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     // 1. Check if the email exists in Firebase
//     const userRecord = await admin.auth().getUserByEmail(email);

//     // 2. Generate a random 9-digit password
//     const newPassword = Math.floor(100000000 + Math.random() * 900000000).toString();

//     // 3. Hash the password
//     const hashedPassword = await bcrypt.hash(newPassword, 10);

//     // 4. Update the password in Firebase
//     await admin.auth().updateUser(userRecord.uid, { password: hashedPassword });

//     // 5. Send the password to the user via email
//     sendPasswordEmail(email, newPassword);

//     // 6. Send response back to the client
//     res.status(200).json({ message: 'Password reset successfully. Check your email.' });
//   } catch (error) {
//     console.error('Error: ', error);
//     res.status(500).json({ message: 'User not found or something went wrong.' });
//   }
// };

// module.exports = { forgotPassword };
