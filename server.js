// server.js
const express = require('express');
const bodyParser = require('body-parser');
const passwordResetRoutes = require('./src/app/services/passwordResetRoutes');


const app = express();

// Use body-parser middleware to parse JSON requests
app.use(bodyParser.json());

// Mount your password reset routes under '/api'
app.use('/api', passwordResetRoutes);

// Get port from environment or default to 3000
const PORT = process.env['PORT'] || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
