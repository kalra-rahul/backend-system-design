const express = require('express');
const { verifyToken, checkRole } = require('../middleware/auth');
const Patient = require('../models/Patient');
const router = express.Router();

router.post('/', verifyToken, checkRole(['admin', 'nurse']), async (req, res) => {
  const patient = new Patient(req.body);
  await patient.save();
  res.status(201).json({ message: 'Patient saved securely' });
});

module.exports = router;