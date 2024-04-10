const salaModel = require("../models/salaModels");
const usuarioModel = require('../models/usuarioModel');
exports.get=async()=>{

    return await salaModel.listarSalas();
}

exports.get= async (req, res) => {
    return await salaModel.listarSalas();
  }

  exports.entrar = async (iduser, idsala) => {
    const sala = await salaModel.buscarSala(idsala);
    console.log("Sala encontrada:", sala);
    let usuarioModel = require('../models/usuarioModel');
    let user = await usuarioModel.buscarUsuario(iduser);
    if (sala) {
      user.sala = {
          _id: sala._id,
          nome: sala.nome,
          tipo: sala.tipo
      };
  } else {
  }
    if (await usuarioModel.alterarUsuario(user)) {
        return { msg: "OK", timestamp: timestamp = Date.now() };
    }
    return false;
}

    //enviar mensagem
exports.enviarMensagem= async (nick, msg, idsala)=>{
  console.log(idsala);
  const sala = await salaModel.buscarSala(idsala);
console.log(sala);
    if(!sala.msgs){
    sala.msgs=[];
  }
  console.log(sala.msgs); 
  timestamp=Date.now()
  sala.msgs.push(
    {
      timestamp:timestamp,
      msg:msg,
      nick:nick
    }
  )
  let resp = await salaModel.atualizarMensagens(sala);
  return {"msg":"OK", "timestamp":timestamp};
}

    //listar mensagem
  exports.buscarMensagens = async (idsala, timestamp)=>{
    let mensagens=await salaModel.buscarMensagens(idsala, timestamp);
    return {
      "timestamp":mensagens[mensagens.length - 1].timestamp,
      "msgs":mensagens
    };
  }
    // sair da sala
exports.sair = async (idUser) => {
  let user = await usuarioModel.buscarUsuario(idUser);
  
  user.sala = null;
  if (await usuarioModel.alterarUsuario(user)) {
    return await salaModel.listarSalas();
  }
  return false;
};

// sair Usuario
exports.sairUser = async (idUser) => {
  let user = await usuarioModel.buscarUsuario(idUser);
  
  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  if (await salaModel.removerUsuario(idUser)) {
    return { msg: "OK" };
  } else {
    return false;
  }
    };