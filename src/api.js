const express = require("express");
const app = express();
//const cors = require('cors');
const token = require('./util/token');
const salaController = require('./controllers/salaController');
const usuarioController = require('./controllers/usuarioController');

//app.use(cors());
app.use(express.urlencoded({extended : true}));
app.use(express.json());

const router = express.Router();
app.use('/', router.get('/', (req, res)=>{
    res.status(200).send("<h1>API - CHAT<h1>")
}));

app.use("/",router.get("/sobre", (req, res, next) => {
    res.status(200).send({
        "nome":"API - CHAT",
        "versão":"0.1.0",
        "autor":"Luís Eduardo da Silva"
    })
}));

    //entrar no CHAT  
app.use("/entrar",router.post("/entrar", async(req, res, next) =>{
  const usuarioController = require("./controllers/usuarioController");
  let resp= await usuarioController.entrar(req.body.nick);
  res.status(200).send(resp);
}));

  //listar as salas 
app.use("/salas",router.get("/salas", async (req, res,next) => {
    if(await
       token.checkToken(req.headers.token, req.headers.iduser, req.headers.nick)) {
    let resp= await salaController.get();
    res.status(200).send(resp);
  }else{
    res.status(400).send({msg:"Usuário não autorizado"});
  }
}))

    //entrar na sala 
app.use("/sala/entrar", router.put("/sala/entrar", async (req, res)=>{
    if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick))
     return false;
    let resp= await salaController.entrar(req.headers.iduser, req.query.idsala);
    res.status(200).send(resp);
  }))

    //enviar mensagem
  app.use("/sala/mensagem/", router.post("/sala/mensagem", async (req, res) => {
    if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) 
    return false;
    let resp= await salaController.enviarMensagem(req.headers.nick, req.body.msg, req.body.idSala);
    res.status(200).send(resp);
  }))  

    //listar mensagens 
app.use("/sala/mensagens/", router.get("/sala/mensagens", async (req, res) => {
    if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) return false;
    let resp= await salaController.buscarMensagens(req.query.idSala, req.query.timestamp);
    res.status(200).send(resp);
  }))

  // sair da sala
app.use("/sala/sair", router.put("/sala/sair", async (req, res) => {
  if(!token.checkToken(req.headers.token,req.headers.iduser,req.headers.nick)) 
  return false;
  let resp= await salaController.sair(req.headers.iduser);
  res.status(200).send(resp);
}))

// sair Usuario
app.use("/sair-user", router.post("/sair-user", async (req, res) => {
  if(!token.checkToken(req.headers.token,req.headers.idUser,req.headers.nick)) 
  return false;
  let resp= await salaController.sairUser(req.query.idUser);
  res.status(200).send(resp);
}))

module.exports=app;