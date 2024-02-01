const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');
const cors = require('cors');
require('dotenv').config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/tasks', require('./routes/task'));

// console.log(process.env.MONGO_URI);
// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    const PORT = 5000;
    app.listen(PORT, () => {
      console.log('Server is running on port 5000');
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

  // Add cron jobs to server.js
const cron = require('node-cron');
const taskController = require('./controllers/taskController');

// Cron job for changing priority of tasks based on due_date
cron.schedule('0 0 * * *', () => {
  taskController.updateTaskPriority();
});

// Cron job for voice calling using Twilio
cron.schedule('0 12 * * *', () => {
  taskController.makeVoiceCalls();
});