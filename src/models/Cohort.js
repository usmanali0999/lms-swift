const mongoose = require('mongoose');

const cohortSchema = new mongoose.Schema({
    cohort_name: {
        type: String,
        required: true,
        trim: true
    },
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    instructor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    min_cohort_size: {
        type: Number,
        default: 5
    },
    max_capacity: {
        type: Number,
        default: 30
    },
    start_date_utc: {
        type: Date,
        required: true
    },
    end_date_utc: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['DRAFT', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
        default: 'SCHEDULED'
    },
    enrolled_learners: [{
        learner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        enrolled_at_utc: { type: Date, default: Date.now }
    }]
}, {
    timestamps: { createdAt: 'created_at_utc', updatedAt: 'updated_at_utc' }
});

module.exports = mongoose.model('Cohort', cohortSchema);