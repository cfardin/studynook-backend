const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require("cors");
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const client = new MongoClient(process.env.MONGODB_URI);

async function connectToMongoDB() {
  try {
    await client.connect();

    const db = client.db("studynook");
    const roomCollection = db.collection("rooms");

    // api for getting all rooms 
    app.get('/rooms', async(req, res) =>{
      const result = await roomCollection.find().toArray();
      res.json(result);
    })


    // api for getting room by user emails 
    app.get('/rooms/host/:email', async(req, res) => {
      const {email} = req.params;
      const result = await roomCollection.find({ "host.email" : email }).toArray();

      res.json(result);
    });

    app.get(`/rooms/:id`, async(req, res) =>{
      const { id } = req.params;
      const result = await roomCollection.findOne({_id : new ObjectId(id)});
      res.json(result);
    });


    // api for adding rooms
    app.post("/rooms", async(req, res) =>{
      const newRoomData = req.body;
      console.log(newRoomData);
      const result = await roomCollection.insertOne(newRoomData);
      res.json(result);
    });

    // api for deleting rooms
    app.delete(`/rooms/:id`, async(req, res) =>{
      const {id} = req.params;
      const result = await roomCollection.deleteOne({_id : new ObjectId(id)});
    });

    







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