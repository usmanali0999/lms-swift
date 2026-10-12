// Centralized Error Handling Middleware for LMS
const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR LOG]: ${err.stack}`);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || 'Internal Server Error',
            code: err.code || 'SERVER_ERROR',
            timestamp: new Date().toISOString() // Mandatory UTC timestamp
        }
    });
};

module.exports = errorHandler;