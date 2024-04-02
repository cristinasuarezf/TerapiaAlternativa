const express = require('express')
const router = express.Router()
const Paciente = require('../models/paciente')

router.get('/', async (req, res) => {
  let pacientes
  try {
    pacientes = await Paciente.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    pacientes = []
  }
  res.render('index', { pacientes: pacientes })
})

module.exports = router