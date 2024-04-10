const salaModel = require("../models/salaModels");
const usuarioModel = require('../models/usuarioModel');

exports.get= async (req, res) => {
    return await salaModel.listarSalas();
  }
 
exports.entrar= async (iduser,idsala)=>{
    const sala = await salaModel.buscarSala(idsala);
    let user = await usuarioModel.buscarUsuario(iduser);
console.log(sala);
    user.sala = {_id:sala._id, nome:sala.nome, tipo:sala.tipo};
    
    if(await usuarioModel.alterarUsuario(user)){
      return {msg:"OK", timestamp:timestamp=Date.now()};
    }
    return false;  
}
// enviar msg
exports.enviarMensagem= async (nick, msg, idsala)=>{
  const sala = await salaModel.buscarSala(idsala);
    if(!sala.msgs){
    sala.msgs=[];
  }
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

exports.buscarMensagens = async (idsala, timestamp)=>{
  let mensagens=await salaModel.buscarMensagens(idsala, timestamp);
  return {
    "timestamp":mensagens[mensagens.length - 1].timestamp,
    "msgs":mensagens
  };
}  
// sair da sala
exports.sair = async (iduser) => {
    let user = await usuarioModel.buscarUsuario(iduser);
  
    user.sala = null;
    if (await usuarioModel.alterarUsuario(user)) {
      return await salaModel.listarSalas();
    }
    return false;
};

// sair Usuario
exports.sairUser = async (idUser) => {
    let user = await usuarioModel.buscarUsuario(idUser);
    console.log(!user);
    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    if (await salaModel.removerUsuario(idUser)) {
      return { msg: "OK" };
    } else {
      return false;
    }
};