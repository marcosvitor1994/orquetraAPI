const bcrypt = require('bcrypt');
const User = require('../models/usuarios');

class UserController {

	async list(req, res) {

		try {
			const limit = req.query.limit || 3;
			const page = req.query.page || 1;
	
			User.find({}).select('-senha').then((users) => {
				return res.json({
					error: false,
					users
				});
			}).catch(() => {
				return res.status(400).json({
					error: true,
					code: 100,
					message: "Erro: Não foi possível executar a solicitação!"
				});
			});
		} catch (error) {
			return res.status(500).json({
				status: 'error',
				msg: error
			});
		}

	}

	async listOne(req, res) {

		try {
			
			User.findOne({ _id: req.params.id }, '_id nome email createAt updateAt').then((user) => {
				return res.json({
					error: false,
					user: user
				});
			}).catch((err) => {
				return res.status(400).json({
					error: true,
					code: 110,
					message: "Erro: Não foi possível executar a solicitação!"
				});
			});

		} catch (error) {
			return res.status(500).json({
				status: 'error',
				msg: error
			});
		}

	}

	async create(req, res) {
		
		try {
			const emailExiste = await User.findOne({ email: req.body.email });
	
			if (emailExiste) {
				return res.status(400).json({
					error: true,
					code: 120,
					message: "Error: Este e-mail já está cadastrado!"
				});
			};
	
			const user = req.body;
			user.senha = await bcrypt.hash(user.senha, 8);
	
			User.create(user).then((user) => {
				return res.json( user );
				
			}).catch((err) => {
				return res.status(400).json({
					error: true,
					code: 121,
					message: "Error: Usuário não foi cadastrado com sucesso"
				});
			});
			
		} catch (error) {
			return res.status(500).json({
				status: 'error',
				msg: error
			});
		}

	}

	async update(req, res) {

		try {
			const usuarioExiste = await User.findOne({_id: req.params.id});
	
			if(!usuarioExiste){
				return res.status(400).json({
					error: true,
					code: 131,
					message: "Erro: Usuário não encontrado!"
				});
			};
	
			if(req.body.email !== usuarioExiste.email){
				const emailExiste = await User.findOne({email: req.body.email});
				if(emailExiste){
					return res.status(400).json({
						error: true,
						code: 132,
						message: "Erro: Este e-mail já está cadastrado!"
					});
				};
			};
			
			User.updateOne({_id: req.params.id}, req.body).then(() => {
				return res.json({
					error: false,
					message: "Usuário editado com sucesso!"
				});
			}).catch((err) => {
				return res.status(400).json({
					error: true,
					code: 133,
					message: "Erro: Usuário não foi editado com sucesso!"
				});
			});

		} catch (error) {
			return res.status(500).json({
				status: 'error',
				msg: error
			});
		}


	}
	
	async delete(req, res) {

		try {
			
			User.deleteOne({ _id: req.params.id }).then(() => {
				return res.json({
					error: false,
					message: "Usuário apagado com sucesso!"
				});
			}).catch((err) => {
				return res.status(400).json({
					error: true,
					code: 140,
					message: "Error: Usuário não foi apagado com sucesso!"
				});
			});

		} catch (error) {
			return res.status(500).json({
				status: 'error',
				msg: error
			});
		}

	}
}

module.exports = new UserController();
