const { MongoClient, ObjectId} = require('mongodb');

let singleton;

async function connect() {
    if (singleton) return singleton;

    const client = new MongoClient(process.env.DB_HOST);
    await client.connect();

    singleton = client.db(process.env.DB_DATABASE);
    return singleton;
}

async function findALL(collection) {
    const db = await connect();
    return db.collection(collection).find().toArray();
}

async function insertOne(collection, objeto){
  console.log(collection)
  console.log(objeto);
  const db = await connect();
  console.log(1)
  return db.collection(collection).insertOne(objeto);
}


let findAll = async (collection)=>{
    const db = await connect();
    return await db.collection(collection).find().toArray();
  }

  let findOne = async (collection, _id)=>{
    const db = await connect();
    let obj= await db.collection(collection).find({'_id':new ObjectId(_id)}).toArray();
    if(obj)
      return obj[0];
    return false;
  }
  
  
  let updateOne= async (collection, object, param)=>{
    const db = await connect();
    let result= await db.collection(collection).updateOne(param, { $set: object} );
    return result;
  }
  
  let deleteOne = async (collection, param) => {
    const db = await connect();
    let result = await db.collection(collection).deleteOne(param);
    return result;
  }
  
  module.exports = { findAll, findALL, insertOne, updateOne, findOne, deleteOne}
