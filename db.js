const { MongoClient, ObjectId } = require("mongodb");

const PAGE_SIZE = 10;

async function connect() {
  if (global.connection) return global.connection;

  const client = new MongoClient(process.env.MONGODB_CONNECTION);

  try {
    await client.connect();
    global.connection = client.db(process.env.MONGODB_DATABASE);
    console.log("Connected!!!");
  } catch (err) {
    console.error(err);
    global.collection = null;
  }

  return global.connection;
}

async function insert(operation) {
  console.log("Inserting operation:", operation);
  const connection = await connect();
  return connection.collection("operations").insertOne(operation);
}

module.exports = {
  connect,
  insert,
};
