const express = require('express')
const router = express.Router()
const Paciente = require('../models/paciente')
const Especialista = require('../models/especialista')

// All Pacientes Route
router.get('/', async (req, res) => {
  let query = Paciente.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try {
    const pacientes = await query.exec()
    res.render('pacientes/index', {
      pacientes: pacientes,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Paciente Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Paciente())
})

// Create Paciente Route
router.post('/', async (req, res) => {
  const paciente = new Paciente({
    title: req.body.title,
    especialista: req.body.especialista,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })
  //saveCover(paciente, req.body.cover)

  try {
    const newPaciente = await paciente.save()
    res.redirect(`pacientes/${newPaciente.id}`)
  } catch {
    renderNewPage(res, paciente, true)
  }
})

// Show Paciente Route
router.get('/:id', async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id)
                           .populate('especialista')
                           .exec()
    res.render('pacientes/show', { paciente: paciente })
  } catch {
    res.redirect('/')
  }
})

// Edit Paciente Route
router.get('/:id/edit', async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id)
    renderEditPage(res, paciente)
  } catch {
    res.redirect('/')
  }
})

// Update Paciente Route
router.put('/:id', async (req, res) => {
  let paciente

  try {
    paciente = await Paciente.findById(req.params.id)
    paciente.title = req.body.title
    paciente.especialista = req.body.especialista
    paciente.publishDate = new Date(req.body.publishDate)
    paciente.pageCount = req.body.pageCount
    paciente.description = req.body.description
    /*if (req.body.cover != null && req.body.cover !== '') {
      saveCover(paciente, req.body.cover)
    }*/
    await paciente.save()
    res.redirect(`/pacientes/${paciente.id}`)
  } catch {
    if (paciente != null) {
      renderEditPage(res, paciente, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Paciente Page
router.delete('/:id', async (req, res) => {
  let paciente
  try {
    paciente = await Paciente.findById(req.params.id)
    await paciente.deleteOne()
    res.redirect('/pacientes')
  } catch {
    if (paciente != null) {
      res.render('pacientes/show', {
        paciente: paciente,
        errorMessage: 'No se pudo eliminar al paciente'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, paciente, hasError = false) {
  renderFormPage(res, paciente, 'new', hasError)
}

async function renderEditPage(res, paciente, hasError = false) {
  renderFormPage(res, paciente, 'edit', hasError)
}

async function renderFormPage(res, paciente, form, hasError = false) {
  try {
    const especialistas = await Especialista.find({})
    const params = {
      especialistas: especialistas,
      paciente: paciente
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error al modificar Paciente'
      } else {
        params.errorMessage = 'Error al crear Paciente'
      }
    }
    res.render(`pacientes/${form}`, params)
  } catch {
    res.redirect('/pacientes')
  }
}

/*
function saveCover(paciente, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    paciente.coverImage = new Buffer.from(cover.data, 'base64')
    paciente.coverImageType = cover.type
  }
}
*/
module.exports = router