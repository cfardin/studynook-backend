const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 5000;
const client = new MongoClient(process.env.MONGODB_URI);

async function connectToMongoDB() {
  try {
    await client.connect();

    const db = client.db("studynook");
    const roomCollection = db.collection("rooms");


    // api for adding rooms
    app.post("/rooms", async(req, res) =>{
      const newRoomData = req.body;
      const result = await roomCollection.insertOne(newRoomData);

      res.json(result);
    })




    console.log("Connected to MongoDB");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

async function disconnectFromMongoDB() {
  await client.close();
}

connectToMongoDB();

app.get('/', (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { connectToMongoDB, disconnectFromMongoDB };