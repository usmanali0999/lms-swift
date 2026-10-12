const mongoose = require('mongoose');

const breakSegmentSchema = new mongoose.Schema({
    break_type: {
        type: String,
        enum: ['BREAKFAST', 'BRUNCH', 'LUNCH', 'DINNER', 'PRAYER', 'PERSONAL', 'TECHNICAL_ISSUE', 'CUSTOM'],
        required: true
    },
    start_time_utc: { type: Date, required: true },
    end_time_utc: { type: Date, default: null },
    duration_minutes: { type: Number, default: 0 }
});

const attendanceSchema = new mongoose.Schema({
    learner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cohort_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cohort',
        required: true
    },
    session_date_utc: {
        type: String, // YYYY-MM-DD
        required: true
    },
    check_in_utc: {
        type: Date,
        required: true
    },
    check_out_utc: {
        type: Date,
        default: null
    },
    breaks: [breakSegmentSchema],
    total_active_minutes: { type: Number, default: 0 },
    total_break_minutes: { type: Number, default: 0 },
    total_idle_minutes: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['CHECKED_IN', 'ON_BREAK', 'CHECKED_OUT', 'INACTIVE'],
        default: 'CHECKED_IN'
    }
}, {
    timestamps: { createdAt: 'created_at_utc', updatedAt: 'updated_at_utc' }
});

module.exports = mongoose.model('Attendance', attendanceSchema);