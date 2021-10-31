const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

console.log(process.env.DB_USER, process.env.DB_PASS);

// MongoDb
const uri = `mongodb+srv://Google:GGbois@cluster0.91aij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Run Function
const run = async () => {
  try {
    await client.connect();
    const database = client.db('HotelCalifornia');
    const roomsCollection = database.collection('Rooms');
    const orderCollection = database.collection('Orders');

    // Get all rooms
    app.get('/api/rooms', async (req, res) => {
      const rooms = await roomsCollection.find({}).toArray();
      res.send(rooms);
    });

    // Get room by id
    app.get('/api/rooms/:id', async (req, res) => {
      const room = await roomsCollection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.send(room);
    });

    // Get all orders
    app.get('/api/orders', async (req, res) => {
      const orders = await orderCollection.find({}).toArray();
      res.send(orders);
    });

    // Get order by id
    app.get('/api/orders/:id', async (req, res) => {
      const order = await orderCollection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.send(order);
    });

    // Create new room
    app.post('/api/rooms', async (req, res) => {
      const { name, description, price, image } = req.body;
      const newRoom = { name, description, price, image };
      const result = await roomsCollection.insertOne(newRoom);
      const newId = result.insertedId;
      const newRoomWithId = await roomsCollection.findOne({ _id: newId });
      res.send(newRoomWithId);
    });

    // Create new order
    app.post('/api/orders', async (req, res) => {
      const { name, email, phone, product } = req.body;
      product.orderStatus = 'Pending';
      const newOrder = {
        name,
        email,
        phone,
        product,
      };

      const result = await orderCollection.insertOne(newOrder);
      const newId = result.insertedId;
      const newOrderWithId = await orderCollection.findOne({ _id: newId });
      res.send(newOrderWithId);
    });

    // Update order Status
    app.put('/api/orders/:id', async (req, res) => {
      const { id } = req.params;
      const result = await orderCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: { orderStatus: 'Approved' } }
      );
      res.send(result);
    });
  } finally {
    // await client.close()
  }
};
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('All Right');
});

app.listen(port, () => {
  console.log('Listening To Port ', port);
});
