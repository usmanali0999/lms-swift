const Course = require('../models/Course');
const Cohort = require('../models/Cohort');
const AuditLog = require('../models/AuditLog');

// @desc    Create new Course (Admin only)
// @route   POST /api/v1/courses
// @access  Private (SUPER_ADMIN, COURSE_ADMIN)
exports.createCourse = async (req, res, next) => {
    try {
        const course = await Course.create({
            ...req.body,
            created_by: req.user._id
        });

        // Audit Logging
        await AuditLog.create({
            user_id: req.user._id,
            employee_id: req.user.employee_id,
            action: 'CREATE_COURSE',
            module: 'COURSE',
            details: { course_code: course.course_code, title: course.title }
        });

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: course
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all Courses
// @route   GET /api/v1/courses
// @access  Private (All Roles)
exports.getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({ is_active: true });
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create Cohort for a Course
// @route   POST /api/v1/courses/cohorts
// @access  Private (SUPER_ADMIN, COURSE_ADMIN)
exports.createCohort = async (req, res, next) => {
    try {
        const cohort = await Cohort.create(req.body);

        await AuditLog.create({
            user_id: req.user._id,
            employee_id: req.user.employee_id,
            action: 'CREATE_COHORT',
            module: 'COHORT',
            details: { cohort_name: cohort.cohort_name, course_id: cohort.course_id }
        });

        res.status(201).json({
            success: true,
            message: 'Cohort scheduled successfully',
            data: cohort
        });
    } catch (error) {
        next(error);
    }
};