const express = require('express')
const router = express.Router()
const Especialista = require('../models/especialista')
const Paciente = require('../models/paciente')

// All Especialistas Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const especialistas = await Especialista.find(searchOptions)
    res.render('especialistas/index', {
      especialistas: especialistas,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Especialista Route
router.get('/new', (req, res) => {
  res.render('especialistas/new', { especialista: new Especialista() })
})

// Create Especialista Route
router.post('/', async (req, res) => {
  const especialista = new Especialista({
    name: req.body.name
  })
  try {
    const newEspecialista = await especialista.save()
    res.redirect(`especialistas/${newEspecialista.id}`)
  } catch {
    res.render('especialistas/new', {
      especialista: especialista,
      errorMessage: 'Error al crear Especialista'
    })
  }
})

// Show Especialista Route
router.get('/:id', async (req, res) => {
  try {
    const especialista = await Especialista.findById(req.params.id)
    const pacientes = await Paciente.find({ especialista: especialista.id }).limit(6).exec()
    res.render('especialistas/show', {
      especialista: especialista,
      pacientesByEspecialista: pacientes
    })
  } catch {
    res.redirect('/')
  }
})

// Edit Especialista Route
router.get('/:id/edit', async (req, res) => {
  try {
    const especialista = await Especialista.findById(req.params.id)
    res.render('especialistas/edit', { especialista: especialista })
  } catch {
    res.redirect('/especialistas')
  }
})

// Update Especialista Route
router.put('/:id', async (req, res) => {
  let especialista
  try {
    especialista = await Especialista.findById(req.params.id)
    especialista.name = req.body.name
    await especialista.save()
    res.redirect(`/especialistas/${especialista.id}`)
  } catch {
    if (especialista == null) {
      res.redirect('/')
    } else {
      res.render('especialistas/edit', {
        especialista: especialista,
        errorMessage: 'Error al actualizar Especialista'
      })
    }
  }
})

// Delete Especialista Page
router.delete('/:id', async (req, res) => {
  let especialista
  try {
    especialista = await Especialista.findById(req.params.id)
    await especialista.deleteOne()
    res.redirect('/especialistas')
  } catch {
    if (especialista == null) {
      res.redirect('/')
    } else {
      res.redirect(`/especialistas/${especialista.id}`)
    }
  }
})

module.exports = router