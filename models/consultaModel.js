const mongoose = require("mongoose");


const consultaSchema = new mongoose.Schema({
  medico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Medico",
  },
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Paciente",
  },
  data_hora: Date,
  status: {
    type: String,
    enum: ["Disponível", "Ocupado", "Confirmado", "Não realizado"],
    default: "Disponível",
  },
});


module.exports = mongoose.model("consulta", consultaSchema);
