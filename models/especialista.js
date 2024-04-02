const mongoose = require('mongoose')

const especialistaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Especialista', especialistaSchema)