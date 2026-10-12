const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    employee_id: {
        type: String,
        default: 'SYSTEM'
    },
    action: {
        type: String, // e.g., 'USER_LOGIN', 'COURSE_CREATED', 'ATTENDANCE_CHECKIN'
        required: true
    },
    module: {
        type: String, // e.g., 'AUTH', 'COURSE', 'ATTENDANCE', 'ASSESSMENT'
        required: true
    },
    ip_address: {
        type: String,
        default: '127.0.0.1'
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    timestamp_utc: {
        type: Date,
        default: () => new Date().toISOString()
    }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);