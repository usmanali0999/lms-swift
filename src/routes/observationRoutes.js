const express = require('express');
const router = express.Router();
const { submitObservation, getLearnerObservations } = require('../controllers/observationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/', authorize('TRAINER', 'SUPER_ADMIN'), submitObservation);
router.get('/learner/:learnerId', getLearnerObservations);

module.exports = router;