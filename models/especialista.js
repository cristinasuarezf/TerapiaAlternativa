const mongoose = require('mongoose')
const Paciente = require('./paciente')

const especialistaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

especialistaSchema.pre('remove', function(next) {
  Paciente.find({ especialista: this.id }, (err, pacientes) => {
    if (err) {
      next(err)
    } else if (pacientes.length > 0) {
      next(new Error('Este especialista todavía tiene pacientes asignados'))
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('Especialista', especialistaSchema)