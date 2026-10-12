const express = require('express');
const router = express.Router();
const { getEmployee360Profile, awardRecognition } = require('../controllers/emsController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.get('/employee-360/:employee_id', getEmployee360Profile);
router.post('/recognition', awardRecognition);

module.exports = router;