const { MedicoModel, UserModel } = require("../models/usuarios");
const bcrypt = require('bcrypt');

MedicoModel;

class MedicoController {
  async list(req, res, next) {
    try {
      MedicoModel.find({})
        .then((medicos) => {
          res.json({
            error: false,
            medicos,
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

  async listOne(req, res) {
    try {
      MedicoModel.findById(req.params.pid)
        .then((medico) => {
          res.json({
            error: false,
            medico,
          });
        })
        .catch((err) => {
          res.status(400).json({
            error: true,
            message: "Erro, medico não encontrado!",
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

      if (req.body.senha){
        req.body.senha = await bcrypt.hash(req.body.senha, 8);
      }

      MedicoModel.create(req.body)
        .then((medico) => {
          return res.json({
            error: false,
            medico,
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

      MedicoModel.updateOne({ _id: req.params.pid }, req.body)
        .then(() => {
          return res.json({
            error: false,
            message: "Medico atualizado com sucesso!",
          });
        })
        .catch((err) => {
          console.log(err.name);
          console.log(err.message);

          if (err.name === "CastError") {
            return res.status(400).json({
              error: true,
              message: "Medico não encontrado!",
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
      MedicoModel.deleteOne({ _id: req.params.pid })
        .then(() => {
          res.json({
            error: false,
            message: "Medico deletado com sucesso!",
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

module.exports = new MedicoController();
