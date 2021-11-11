const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cvpyv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Main Async Function
async function run() {
  try {
    await client.connect();
    // console.log('Successfully Connected');
    const database = client.db("drones");
    // const productCollection = database.collection("products");
    // const dummyCollection = database.collection("dummy");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("allorders");
    const reviewCollection = database.collection("reviews");
    const userCollection = database.collection("users");

    /*-------------------------------------------------------------------------------*\
  //////////////////////////////// All Products \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
\*-------------------------------------------------------------------------------*/

    // POST API For All Products
    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productCollection.insertOne(product);
      console.log(result);
      res.json(result);
    });

    //Get All Products API
    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.json(products);
    });

    //Get Single Product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Single product", id);
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.json(product);
    });

    /*-------------------------------------------------------------------------------*\
  //////////////////////////////// All Orders \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
\*-------------------------------------------------------------------------------*/

    // POST API For All Products
    app.post("/allorders", async (req, res) => {
      const order = req.body;
      console.log(order);
      const result = await orderCollection.insertOne(order);
      console.log(result);
      res.json(result);
    });

    //Get All Products API
    app.get("/allorders", async (req, res) => {
      const cursor = orderCollection.find({});
      const allorders = await cursor.toArray();
      res.json(allorders);
    });

    /*-------------------------------------------------------------------------------*\
  //////////////////////////////// All Orders \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
\*-------------------------------------------------------------------------------*/

    //Get My Orders by email
    app.get("/myorders", async (req, res) => {
      let query = {};
      const email = req.query.email;
      if (email) {
        query = { userEmail: email };
      }
      const cursor = orderCollection.find(query);
      const orders = await cursor.toArray();
      res.json(orders);
    });

    //Delete My Orders
    app.delete("/myorders/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Deleted Order", id);
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      console.log("Deleted", result);
      res.json(result);
    });

    /*-------------------------------------------------------------------------------*\
  //////////////////////////////// Users \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
\*-------------------------------------------------------------------------------*/

    //POST API For Users
    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    //Get Users API
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find({});
      const users = await cursor.toArray();
      res.json(users);
    });

    /*-------------------------------------------------------------------------------*\
  //////////////////////////////// Reviews \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
\*-------------------------------------------------------------------------------*/

    //POST API For Reviews
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      console.log(review);
      const result = await reviewCollection.insertOne(review);
      console.log(result);
      res.json(result);
    });

    //Get Reviews API
    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find({});
      const reviews = await cursor.toArray();
      res.json(reviews);
    });

    /////////////////////////////END of Async Function\\\\\\\\\\\\\\\\\\\\\\\\\
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

//Test The Server Connection
app.get("/", (req, res) => {
  res.send("Running Drone Server.");
});

app.listen(port, () => {
  console.log("Welcome to PORT", port);
});
