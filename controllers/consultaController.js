const {UserModel, MedicoModel, AtendenteModel, PacienteModel, AdminModel} = require("../models/usuarios.js");
const bcrypt = require('bcrypt');
const consultaModel = require("../models/consultaModel.js");

class consultaController {
    
  
    async updateConsulta(req, res) {
		try {
			const idExiste = await consultaModel.findOne({ _id: req.params.id });
	
			if (idExiste) {
				return res.status(400).json({
					error: true,
					code: 120,
					message: "Error: Esta consulta não está cadastrado!"
				});
			};

			
			consultaModel.updateOne({_id: req.params.pid}, req.body).then(() => {
				return res.json({
					error: false,
					message: "Consulta editada com sucesso!"
				});
			}).catch((err) => {
				return res.status(400).json({
					error: true,
					code: 133,
					message: "Erro: Consulta não foi editada com sucesso!"
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

module.exports = new consultaController(); 