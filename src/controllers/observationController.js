const Observation = require('../models/Observation');

// Submit Instructor Rubric Evaluation
exports.submitObservation = async (req, res, next) => {
    try {
        const observation = await Observation.create({
            ...req.body,
            trainer_id: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Instructor observation rubric saved',
            data: observation
        });
    } catch (error) {
        next(error);
    }
};

// Get Learner Soft Skills & Rubrics History
exports.getLearnerObservations = async (req, res, next) => {
    try {
        const observations = await Observation.find({ learner_id: req.params.learnerId })
            .populate('trainer_id', 'full_name email');

        res.status(200).json({
            success: true,
            count: observations.length,
            data: observations
        });
    } catch (error) {
        next(error);
    }
};