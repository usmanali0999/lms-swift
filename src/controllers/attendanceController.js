const Attendance = require('../models/Attendance');
const { getCurrentUtcTimestamp } = require('../config/timeUtils');

// 1. Session Check-In
exports.checkIn = async (req, res, next) => {
    try {
        const { cohort_id } = req.body;
        const todayUtc = new Date().toISOString().split('T')[0];

        let record = await Attendance.findOne({
            learner_id: req.user._id,
            cohort_id,
            session_date_utc: todayUtc
        });

        if (record) {
            return res.status(400).json({
                success: false,
                message: 'Active session already exists for today. Single record rule enforced.'
            });
        }

        record = await Attendance.create({
            learner_id: req.user._id,
            cohort_id,
            session_date_utc: todayUtc,
            check_in_utc: getCurrentUtcTimestamp(),
            status: 'CHECKED_IN'
        });

        res.status(201).json({
            success: true,
            message: 'Session Checked-in successfully (UTC Enforced)',
            data: record
        });
    } catch (error) {
        next(error);
    }
};

// 2. Start Break (Lunch, Prayer, etc.)
exports.startBreak = async (req, res, next) => {
    try {
        const { cohort_id, break_type } = req.body;
        const todayUtc = new Date().toISOString().split('T')[0];

        const record = await Attendance.findOne({
            learner_id: req.user._id,
            cohort_id,
            session_date_utc: todayUtc,
            status: 'CHECKED_IN'
        });

        if (!record) {
            return res.status(400).json({ success: false, message: 'No active checked-in session found to start break' });
        }

        record.breaks.push({
            break_type: break_type || 'PERSONAL',
            start_time_utc: getCurrentUtcTimestamp()
        });

        record.status = 'ON_BREAK';
        await record.save();

        res.status(200).json({ success: true, message: `Break '${break_type}' started`, data: record });
    } catch (error) {
        next(error);
    }
};

// 3. End Break & Resume Learning
exports.endBreak = async (req, res, next) => {
    try {
        const { cohort_id } = req.body;
        const todayUtc = new Date().toISOString().split('T')[0];

        const record = await Attendance.findOne({
            learner_id: req.user._id,
            cohort_id,
            session_date_utc: todayUtc,
            status: 'ON_BREAK'
        });

        if (!record || record.breaks.length === 0) {
            return res.status(400).json({ success: false, message: 'No active break segment found to end' });
        }

        const lastBreak = record.breaks[record.breaks.length - 1];
        lastBreak.end_time_utc = getCurrentUtcTimestamp();

        // Calculate break duration in minutes
        const diffMs = new Date(lastBreak.end_time_utc) - new Date(lastBreak.start_time_utc);
        lastBreak.duration_minutes = Math.round(diffMs / 60000);

        record.total_break_minutes += lastBreak.duration_minutes;
        record.status = 'CHECKED_IN';

        await record.save();

        res.status(200).json({ success: true, message: 'Break ended, session resumed', data: record });
    } catch (error) {
        next(error);
    }
};

// 4. Session Check-Out
exports.checkOut = async (req, res, next) => {
    try {
        const { cohort_id } = req.body;
        const todayUtc = new Date().toISOString().split('T')[0];

        const record = await Attendance.findOne({
            learner_id: req.user._id,
            cohort_id,
            session_date_utc: todayUtc
        });

        if (!record) {
            return res.status(400).json({ success: false, message: 'No attendance record found to checkout' });
        }

        record.check_out_utc = getCurrentUtcTimestamp();
        
        // Calculate Total Active Minutes
        const totalSessionMs = new Date(record.check_out_utc) - new Date(record.check_in_utc);
        const totalSessionMins = Math.round(totalSessionMs / 60000);
        
        record.total_active_minutes = Math.max(0, totalSessionMins - record.total_break_minutes);
        record.status = 'CHECKED_OUT';

        await record.save();

        res.status(200).json({ success: true, message: 'Session checked-out successfully', data: record });
    } catch (error) {
        next(error);
    }
};