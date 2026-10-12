const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const connectDB = require('./src/config/db.js');
const { getCurrentUtcTimestamp } = require('./src/config/timeUtils');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();

// Database Initialization
connectDB();

// Global Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));

// Serve Visual Executive Dashboard (Front-End)
app.use(express.static(path.join(__dirname, 'public')));

// Core System Health Check
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        system: "Custom LMS & Development System",
        environment: process.env.NODE_ENV || 'development',
        authoritative_timezone: "UTC",
        current_server_utc_time: getCurrentUtcTimestamp(),
        status: "Operational"
    });
});

// All Core API Modules
app.use('/api/v1/auth', require('./src/routes/authRoutes'));
app.use('/api/v1/courses', require('./src/routes/courseRoutes'));
app.use('/api/v1/attendance', require('./src/routes/attendanceRoutes'));
app.use('/api/v1/assessments', require('./src/routes/assessmentRoutes'));
app.use('/api/v1/observations', require('./src/routes/observationRoutes'));
app.use('/api/v1/ems', require('./src/routes/emsRoutes'));

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 SWIFT LMS Master Core Engine Fully Operational`);
    console.log(`📡 Port: ${PORT}`);
    console.log(`🌐 Visual Dashboard Live: http://localhost:${PORT}`);
    console.log(`🕒 System Standard Time: UTC [${getCurrentUtcTimestamp()}]`);
    console.log(`=======================================================`);
});