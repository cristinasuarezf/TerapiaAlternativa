const mongoose = require('mongoose')

const pacienteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: { //horaCita
    type: String
  },
  publishDate: { //fechaCita
    type: Date,
    required: true
  },
  pageCount: { //edad
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  especialista: { 
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Especialista'
  }
})

module.exports = mongoose.model('Paciente', pacienteSchema)