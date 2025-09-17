const express = require('express');
const { generateContent } = require('../controllers/geminiController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/generate', protect, generateContent);

module.exports = router;
