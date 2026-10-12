const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    learner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cohort_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort', required: true },
    assessment_type: {
        type: String,
        enum: ['BASELINE', 'MODULE', 'PRACTICAL', 'FINAL', 'REMEDIAL'],
        required: true
    },
    title: { type: String, required: true },
    raw_score: { type: Number, required: true },
    total_marks: { type: Number, required: true },
    percentage: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    weak_topics: [{ type: String }],
    triggers_remedial: { type: Boolean, default: false },
    remedial_content_assigned: [{ type: String }]
}, {
    timestamps: { createdAt: 'created_at_utc', updatedAt: 'updated_at_utc' }
});

module.exports = mongoose.model('Assessment', assessmentSchema);