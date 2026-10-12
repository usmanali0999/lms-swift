const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Recognition = require('../models/Recognition');

// Section 18: Get Employee 360 Learning Profile for EMS
exports.getEmployee360Profile = async (req, res, next) => {
    try {
        const { employee_id } = req.params;

        const user = await User.findOne({ employee_id });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Employee not found in LMS' });
        }

        const assessments = await Assessment.find({ learner_id: user._id });
        const recognitions = await Recognition.find({ learner_id: user._id });

        res.status(200).json({
            success: true,
            ems_shared_id: employee_id,
            employee_name: user.full_name,
            department: user.department,
            timezone: user.timezone,
            learning_summary: {
                total_assessments_completed: assessments.length,
                recognitions_earned: recognitions.map(r => r.title),
                skills_acquired: ['Full-Stack Development', 'System Architecture']
            }
        });
    } catch (error) {
        next(error);
    }
};

// Section 18: Award Recognition Badge
exports.awardRecognition = async (req, res, next) => {
    try {
        const recognition = await Recognition.create(req.body);
        res.status(201).json({ success: true, message: 'Recognition Badge Awarded', data: recognition });
    } catch (error) {
        next(error);
    }
};