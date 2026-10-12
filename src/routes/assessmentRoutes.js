const express = require('express');
const router = express.Router();
const { submitAssessment, getLearnerGrowthReport } = require('../controllers/assessmentController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/submit', submitAssessment);
router.get('/growth-report', getLearnerGrowthReport);

module.exports = router;