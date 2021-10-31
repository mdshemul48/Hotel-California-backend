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
    const database = client.db('FoodDelivery');
    const FoodDeliveryCollection = database.collection(
      'FoodDeliveryCollection'
    );
    const orderCollection = database.collection('Orders');
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
