const mongoose = require('mongoose');

const observationSchema = new mongoose.Schema({
    learner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trainer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cohort_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cohort', required: true },
    
    // Configurable 1-10 Rubrics
    engagement_score: { type: Number, min: 1, max: 10, required: true },
    communication_score: { type: Number, min: 1, max: 10, required: true },
    alertness_score: { type: Number, min: 1, max: 10, required: true },
    decision_making_score: { type: Number, min: 1, max: 10, required: true },
    confidence_score: { type: Number, min: 1, max: 10, required: true },
    
    // Qualitative Feedback (Stored separately from academic grades)
    trainer_notes: { type: String, required: true }
}, {
    timestamps: { createdAt: 'created_at_utc', updatedAt: 'updated_at_utc' }
});

module.exports = mongoose.model('Observation', observationSchema);