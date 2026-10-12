const express = require('express');
const router = express.Router();
const { checkIn, startBreak, endBreak, checkOut } = require('../controllers/attendanceController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect); // Protected routes

router.post('/check-in', checkIn);
router.post('/break/start', startBreak);
router.post('/break/end', endBreak);
router.post('/check-out', checkOut);

module.exports = router;