const { PacienteModel, UserModel } = require("../models/usuarios");

PacienteModel;

class PacienteController {
  async list(req, res, next) {
    try {
      PacienteModel.find({})
        .then((Paciente) => {
          res.json({
            error: false,
            Paciente: Paciente,
          });
        })
        .catch((err) => {
          res.status(400).json({
            error: true,
            messa: "Erro ao executar a solicitação!",
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  async listOne(req, res, next) {
    try {
      PacienteModel.findById(req.params.pid)
        .then((Paciente) => {
          res.json({
            error: false,
            Paciente: Paciente,
          });
        })
        .catch((err) => {
          res.status(400).json({
            error: true,
            message: "Erro, paciente não encontrado!",
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  async create(req, res, next) {

    try {

      const emailExiste = await UserModel.findOne({ email: req.body.email });

      if (emailExiste) {
				return res.status(400).json({
					error: true,
					code: 120,
					message: "Error: Este e-mail já está cadastrado!"
				});
			};

      PacienteModel.create(req.body)
        .then((Paciente) => {
          res.json({
            error: false,
            Paciente: Paciente,
          });
        })
        .catch((err) => {
          console.log(err.name);
          console.log(err.message);
          if (err.name === "ValidationError") {
            return res.status(400).json({
              error: true,
              message: err.message,
              ValidationError: err.errors,
            });
          }

          return res.status(400).json({
            error: true,
            message: "Erro ao executar a solitação!",
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  async update(req, res, next) {

    try {

      if (req.body.email) {
        emailExiste = await UserModel.findOne({
          email: req.body.email,
        });
        if (emailExiste) {
          return res.status(400).json({
            error: true,
            message: "Este email já está cadastrado!",
          });
        }
      }

      PacienteModel.updateOne({ _id: req.params.pid }, req.body)
        .then(() => {
          return res.json({
            error: false,
            message: "Paciente atualizado com sucesso!",
          });
        })
        .catch((err) => {
          console.log(err.name);
          console.log(err.message);

          if (err.name === "CastError") {
            return res.status(400).json({
              error: true,
              message: "Paciente não encontrado!",
            });
          }

          if (err.name === "ValidationError") {
            return res.status(400).json({
              error: true,
              message: err.message,
              ValidationError: err.errors,
            });
          }

          return res.status(400).json({
            error: true,
            message: "Erro ao executar a solitação!",
          });
        });
    } catch (error) {
      return next(error);
    }
  }

  async delete(req, res, next) {
    try {
      PacienteModel.deleteOne({ _id: req.params.pid })
        .then(() => {
          res.json({
            error: false,
            message: "Paciente deletado com sucesso!",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).json({
            error: true,
            message: "Erro ao executar a solitação!",
          });
        });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new PacienteController();
