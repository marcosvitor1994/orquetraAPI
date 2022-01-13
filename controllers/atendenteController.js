const { AtendenteModel, UserModel } = require("../models/usuarios");
const bcrypt = require('bcrypt');

AtendenteModel;

class AtendenteController {
  async list(req, res, next) {
    try {
      AtendenteModel.find({})
        .then((atendentes) => {
          res.json({
            error: false,
            atendentes,
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
      AtendenteModel.findById(req.params.pid)
        .then((atendente) => {
          res.json({
            error: false,
            atendente,
          });
        })
        .catch((err) => {
          res.status(400).json({
            error: true,
            message: "Erro, atendente não encontrado!",
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

      if (req.body.senha) {
        req.body.senha = await bcrypt.hash(req.body.senha, 8);
      }

      AtendenteModel.create(req.body)
        .then((Atendente) => {
          res.json({
            error: false,
            Atendente: Atendente,
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

      // se for fornecido a senha, garantir que esteja criptografada.
      if (req.body.senha) {
        req.body.senha = bcrypt.hashSync(req.body.senha, 8);
      }

      AtendenteModel.updateOne({ _id: req.params.pid }, req.body)
        .then(() => {
          return res.json({
            error: false,
            message: "Atendente atualizado com sucesso!",
          });
        })
        .catch((err) => {
          console.log(err.name);
          console.log(err.message);

          if (err.name === "CastError") {
            return res.status(400).json({
              error: true,
              message: "Atendente não encontrado!",
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
      AtendenteModel.deleteOne({ _id: req.params.pid })
        .then(() => {
          res.json({
            error: false,
            message: "Atendente deletado com sucesso!",
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

module.exports = new AtendenteController();
