const express = require('express');
const {
  getSampleRecords,
  getSampleRecordById,
} = require('../controllers/sampleController');

const router = express.Router();

router.get('/', getSampleRecords);
router.get('/:id', getSampleRecordById);

module.exports = router;
