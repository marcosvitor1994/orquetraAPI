const express = require("express");

//rotas
const routes = require("./routes/routes");
//CONEXAO COM BANCO DE DADOS
require("./Database/db.js");


class App {
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes()
  }
  middlewares() {
    this.app.use(express.json());
    
  }
  routes() {
    this.app.use(routes);
  }
  
}

module.exports =  new App().app;
