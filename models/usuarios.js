const mongoose = require("mongoose");

const { consultaSchema } = require("./consultaModel");

const UserSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [false, "Campo nome deve ser preenchido"],
    },
    sexo: {
      type: String,
      required: [false, "Campo sexo deve ser preenchido"],
    },
    email: {
      type: String,
      required: [true, "Campo email deve ser preenchido"],
    },
    endereco: {
      cidade: {
        type: String,
        required: [false, "Campo cidade deve ser preenchido"],
      },
      quadra: {
        type: String,
        required: false,
      },
      rua: {
        type: String,
        required: false,
      },
      estado: {
        type: String,
        required: false,
      },
      cep: {
        type: String,
        required: [false, "Campo cep deve ser preenchido"],
      },
      complemento: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
    discriminatorKey: "_role",
  }
);

const UserModel = mongoose.model("User", UserSchema);
module.exports.UserModel = UserModel;

module.exports.MedicoModel = UserModel.discriminator(
  "Medico",
  new mongoose.Schema({
    crm: {
      type: String,
      required: [true, "O campo CRM deve ser preenchido"],
    },
    senha: {
      type: String,
      required: [true, "O campo senha deve ser preenchido"],
    },
  })
);

module.exports.AtendenteModel = UserModel.discriminator(
  "Atendente",
  new mongoose.Schema({
    senha: {
      type: String,
      required: [true, "O campo senha deve ser preenchido"],
    },
  })
);

module.exports.PacienteModel = UserModel.discriminator(
  "Paciente",
  new mongoose.Schema({})
);

module.exports.AdminModel = UserModel.discriminator(
  "Admin",
  new mongoose.Schema({
    senha: {
      type: String,
      required: [true, "O campo senha deve ser preenchido"],
    },
  })
);
