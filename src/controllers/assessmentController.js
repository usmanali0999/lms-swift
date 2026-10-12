const Assessment = require('../models/Assessment');

// Submit Assessment & Auto-Trigger Remedial Content
exports.submitAssessment = async (req, res, next) => {
    try {
        const { cohort_id, assessment_type, title, raw_score, total_marks, weak_topics } = req.body;

        const percentage = Math.round((raw_score / total_marks) * 100);
        const passed = percentage >= 60;
        const triggers_remedial = !passed || (weak_topics && weak_topics.length > 0);

        // Generate Remedial Recommendations if weak
        let remedial_content_assigned = [];
        if (triggers_remedial && weak_topics) {
            remedial_content_assigned = weak_topics.map(topic => `Remedial Module: Advanced Review of ${topic}`);
        }

        const record = await Assessment.create({
            learner_id: req.user._id,
            cohort_id,
            assessment_type,
            title,
            raw_score,
            total_marks,
            percentage,
            passed,
            weak_topics: weak_topics || [],
            triggers_remedial,
            remedial_content_assigned
        });

        res.status(201).json({
            success: true,
            message: passed ? 'Assessment Passed' : 'Assessment Completed - Remedial Training Triggered',
            data: record
        });
    } catch (error) {
        next(error);
    }
};

// Compare Baseline vs Final Growth Summary
exports.getLearnerGrowthReport = async (req, res, next) => {
    try {
        const records = await Assessment.find({ learner_id: req.user._id });
        
        const baseline = records.find(r => r.assessment_type === 'BASELINE');
        const finalExam = records.find(r => r.assessment_type === 'FINAL');

        const growth_percentage = (baseline && finalExam) 
            ? Math.round(finalExam.percentage - baseline.percentage) 
            : 0;

        res.status(200).json({
            success: true,
            data: {
                total_assessments: records.length,
                baseline_score: baseline ? baseline.percentage : 'Not Taken',
                final_score: finalExam ? finalExam.percentage : 'Not Taken',
                overall_growth_percentage: `${growth_percentage}%`,
                assessments: records
            }
        });
    } catch (error) {
        next(error);
    }
};