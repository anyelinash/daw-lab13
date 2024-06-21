const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  genero: { type: String, required: true },
  fechaLanzamiento: { type: Date, required: true },
  calificacion: { type: Number, required: true, min: 0, max: 10 },
  imageUrl: { type: String}
});

module.exports = mongoose.model('Item', itemSchema);
