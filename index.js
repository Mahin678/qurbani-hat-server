const express = require("express");
const cors = require("cors")
const bodyPerser = require("body-parser");
const { MongoClient,ObjectId } = require('mongodb');
const app = express();
const port = 3000
app.use(cors());
app.use(bodyPerser.json());
// db connection 

const uri = "mongodb+srv://MyDbUser:gorurhat@cluster0.bssu4.mongodb.net/cowdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("cowdb").collection("cows");
  // Post
  app.post("/addCow",(req,res)=>{
      const cow = req.body;
      collection.insertOne(cow)
      .then(result=>{
        console.log(result)
        res.send("success")
      })
  });
  // Get
  app.get("/allCows",(req,res)=>{
      collection.find({})
      .toArray((err,data)=>{
          res.send(data)
      })    
  });
  //Delete
  app.delete("/delete/:id",(req,res)=>{
      collection.deleteOne({_id:ObjectId(req.params.id)})
      .then(result=>console.log(result.deletedCount))
  })
  console.log("db connected");
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})