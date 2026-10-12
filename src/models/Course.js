const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    course_code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Course title is required'],
        trim: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    duration_hours: {
        type: Number,
        required: true
    },
    fee: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'PKR'
    },
    delivery_mode: {
        type: String,
        enum: ['REMOTE', 'PHYSICAL', 'HYBRID'],
        default: 'HYBRID'
    },
    is_active: {
        type: Boolean,
        default: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: { createdAt: 'created_at_utc', updatedAt: 'updated_at_utc' }
});

module.exports = mongoose.model('Course', courseSchema);