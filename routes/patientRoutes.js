const express = require('express');
const { verifyToken,emergencyBypass,checkRole } = require('../middleware/auth');
const Patient = require('../models/Patient');
const rateLimiterMiddleware = require('../middleware/ratelimiter');
const router = express.Router();

router.post('/', verifyToken, rateLimiterMiddleware, checkRole(['admin', 'nurse']), async (req, res) => {
  const patient = new Patient(req.body);
  await patient.save();
  res.status(201).json({ message: 'Patient saved securely' });
});

router.get('/',verifyToken, rateLimiterMiddleware, checkRole(['admin', 'nurse']), async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving patients', error: err });
  }
});



module.exports = router;