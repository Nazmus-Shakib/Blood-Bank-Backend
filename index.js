const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 5000;

app.get("/", (req, res) => {
  res.send("Blood Bank Backend is Working Successfully");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y70ks.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const donorsCollection = client.db("bloodBank").collection("donors");

  // to submit details to database
  app.post("/submitDetails", (req, res) => {
    const donor = req.body;
    donorsCollection.insertOne(donor).then((result) => {
      console.log(result);
    });
  });

  // to read all details from database
  app.get("/donors", (req, res) => {
    donorsCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  // to delete specific resident from database
  app.delete("/deleteDonor/:id", (req, res) => {
    //console.log(req.params.id);
    donorsCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        console.log(result);
        //res.send(result.deletedCount > 0);
      });
  });

  console.log("Database Connected");
  //client.close();
});

app.listen(process.env.PORT || port);
