const mongoose = require('mongoose');

const recognitionSchema = new mongoose.Schema({
    learner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
        type: String,
        enum: ['OUTSTANDING_STUDENT', 'MOST_ENGAGED', 'MOST_IMPROVED', 'BEST_TEAM_CONTRIBUTOR', 'BEST_QUESTION', 'BEST_PRACTICAL'],
        required: true
    },
    awarded_by: { type: String, enum: ['TRAINER', 'PEER', 'SYSTEM'], default: 'TRAINER' },
    title: { type: String, required: true },
    description: { type: String, default: '' }
}, {
    timestamps: { createdAt: 'created_at_utc', updatedAt: 'updated_at_utc' }
});

module.exports = mongoose.model('Recognition', recognitionSchema);