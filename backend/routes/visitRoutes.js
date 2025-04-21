const express = require('express');
const router = express.Router();
const { getVisitCount, incrementVisitCount } = require('../controllers/visitController');

router.get('/', getVisitCount);
router.post('/increment', incrementVisitCount);

module.exports = router;
