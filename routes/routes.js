const { Router, json } = require("express"); 
const bcrypt = require('bcrypt');

const {UserModel, MedicoModel, AtendenteModel, PacienteModel, AdminModel} = require("../models/usuarios.js");
const authMidd = require("../middlewares/auth.js");


const LoginController = require("../controllers/loginController");
const medicoController = require("../controllers/medicoController");
const atendenteController = require("../controllers/atendenteController");
const pacienteController = require("../controllers/pacienteController");
const consultaModel = require("../models/consultaModel");
const profileController = require("../controllers/profileController.js");
const consultaController = require("../controllers/consultaController.js");

const routes = new Router();

// LOGIN - Atendente, Medico, Admin
routes.post('/login', LoginController.login);

//Medicos
routes.get("/medicos", authMidd(["Atendente", "Admin"]), medicoController.list);
routes.get("/medicos/:pid", authMidd(["Atendente", "Admin"]), medicoController.listOne);
routes.post("/medicos", authMidd(["Admin"]), medicoController.create);
routes.put("/medicos/:pid", authMidd(["Medico", "Admin"]), medicoController.update);
routes.delete("/medicos/:pid", authMidd(["Admin"]), medicoController.delete);

// Atendente
routes.get("/atendentes", authMidd(["Atendente", "Admin"]), atendenteController.list)
routes.get("/atendentes/:pid", authMidd(["Atendente", "Admin"]), atendenteController.listOne);
routes.post("/atendentes", authMidd(["Admin"]), atendenteController.create);
routes.put("/atendentes/:pid", authMidd(["Atendente", "Admin"]), atendenteController.update);
routes.delete("/atendentes/:pid", authMidd(["Admin"]), atendenteController.delete);

// Paciente
routes.get("/pacientes", authMidd(["Atendente", "Medico", "Admin"]), pacienteController.list);
routes.get("/pacientes/:pid", authMidd(["Atendente", "Medico", "Admin"]), pacienteController.listOne);
routes.post("/pacientes", authMidd(["Atendente", "Admin"]), pacienteController.create);
routes.put("/pacientes/:pid", authMidd(["Atendente", "Admin"]), pacienteController.update);
routes.delete("/pacientes/:pid", authMidd(["Admin"]), pacienteController.delete);

// Profile
routes.get("/profile", authMidd(["Admin", "Atendente", "Medico"]), profileController.list);
routes.put("/profile", authMidd(["Admin", "Atendente", "Medico"]), profileController.update);
routes.post("/profile/consultas", authMidd(["Medico"]), profileController.createConsulta);
routes.get("/profile/consultas", authMidd(["Medico"]), profileController.listConsultaMedico);
routes.put("/profile/consultas/:pid", authMidd(["Admin", "Medico"]), profileController.updateConsulta);

// Rotas Consultas

// listando todas as consultas 
routes.get("/consultas", authMidd(["Atendente", "Medico" ,"Admin"]), (req, res) => {
    const {medico, paciente, status, data_hora} = req.query;
    consultaModel.find(JSON.parse(JSON.stringify({medico, paciente, status, data_hora}))).then(users =>{ res.json( users ) });
})
routes.put("/consultas/:pid", authMidd(["Atendente", "Admin"]), consultaController.updateConsulta)
// populando todas as consultas
routes.get("/consultas/populate", authMidd(["Atendente", "Admin"]), (req, res)=> {
    consultaModel.find().populate('paciente').populate('medico').then(consultas =>{ 
        res.json( consultas ) 
    });
})
// Populando uma única consulta
routes.get("/consultas/:pid/populate", authMidd(["Atendente", "Admin"]), (req, res)=> {
    consultaModel.findOne({_id: req.params.pid}).populate('paciente').populate('medico').then(consulta =>{ 
        res.json( consulta ) 
    });
})

// Pesquisa de usuários
routes.get("/users", (req, res) => {
    const {nome, sexo, email, _role} = req.query;
    UserModel.find(JSON.parse(JSON.stringify({nome, sexo, email, _role}))).select("-senha").then(users =>{ res.json( users ) });
})


routes.get("/admin", async (req, res) => {
    AdminModel.create({
        email: "admin@sistema.com",
        senha: "$2a$08$RSSVqdQZF9BfEKk.55DX8eQi2DIRtlg/8UAqQEyV/7KrgP6W9T7lC" // 12345678
    }).then((admin) => {
        res.json(admin);
    });
});

routes.get("/", (req, res, next) => {
    res.status(200).json({
        status: "Sucess", 
        msg: "Grupo 04: Henrique, Marcos, Pedro, Roberta, Mateus"
    });
});

routes.use((req, res, next) => {
    res.status(404).json({
        error: true,
        msg: 'Not Found'
    });
})

routes.use((error, req, res, next) => {
    console.log(error)
    return res.status(500).json({
        errror: true,
        message: "Internal Server Error"
    });
});


module.exports = routes;