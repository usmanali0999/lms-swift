const express = require('express');
const router = express.Router();
const { createCourse, getAllCourses, createCohort } = require('../controllers/courseController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect); // Require authentication for all course endpoints

router.route('/')
    .get(getAllCourses)
    .post(authorize('SUPER_ADMIN', 'COURSE_ADMIN'), createCourse);

router.post('/cohorts', authorize('SUPER_ADMIN', 'COURSE_ADMIN'), createCohort);

module.exports = router;