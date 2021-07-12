const express = require("express");
const cors = require("cors")
const bodyPerser = require("body-parser");
const { MongoClient,ObjectId } = require('mongodb');
const app = express();
const port = 3000;
require("dotenv").config();
app.use(cors());
app.use(bodyPerser.json());
// db connection 

const uri = "mongodb+srv://MyDbUser:gorurhat@cluster0.bssu4.mongodb.net/cowdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const cowCollection = client.db("cowdb").collection("cows");
  const serviceCollection = client.db("cowdb").collection("services");
  // Post
  app.post("/addCow",(req,res)=>{
      const cow = req.body;
      cowCollection.insertOne(cow)
      .then(result=>{
        res.send("success")
      })
  });
  app.post("/addService",(req,res)=>{
      const service = req.body;
      serviceCollection.insertOne(service)
      .then(result=>{
        console.log(result)
        res.send("success")
      })
      console.log(service)
  });
  // Get
  app.get("/allCows",(req,res)=>{
    cowCollection.find({})
      .toArray((err,data)=>{
          res.send(data)
      })    
  });
  // cow get by id
  app.get("/allCow/:id",(req,res)=>{
    cowCollection.find({_id:ObjectId(req.params.id)})
      .toArray((err,data)=>{
        res.send(data)
      })
  })
  app.get("/allServices",(req,res)=>{
    serviceCollection.find({})
      .toArray((err,data)=>{
          res.send(data)
      })    
  });
  // get by filter
  app.get("/allCows/:categori",(req,res)=>{
    cowCollection.find({categori:req.params.categori})
    .toArray((err,data)=>{
      res.send(data)
    })
  })
  // Update 
  app.patch("/updateService/:id",(req,res)=>{
    serviceCollection.updateOne({_id:ObjectId(req.params.id)},
      {
        $set:{
          description:req.body.description,
          serial:req.params.serial,
          title:req.params.title
        }
      })
      .then(result=>res.send("Succesfully updated"))
  })
  app.patch("/updateCowInfo/:id",(req,res)=>{
    cowCollection.updateOne({_id:ObjectId(req.params.id)},
      {
        $set:{
          video:req.body.video,
          code:req.body.code,
          categori:req.body.categori,
          address:req.body.address,
          type:req.body.type,
          age:req.body.age,
          teeth:req.body.teeth,
          owner:req.body.owner,
          price:req.body.price,
          thana:req.body.thana,
          weight:req.body.weight,
          height:req.body.height,
          contact:req.body.contact
        }
      })
      .then(result=>console.log(result.modifiedCount))
  })
  //Delete
  app.delete("/deleteCow/:id",(req,res)=>{
    cowCollection.deleteOne({_id:ObjectId(req.params.id)})
      .then(result=>res.send("Succesfully deleted"))
  })
  app.delete("/deleteService/:id",(req,res)=>{
    serviceCollection.deleteOne({_id:ObjectId(req.params.id)})
      .then(result=>res.send("Succesfully deleted"))
  })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})


app.listen(process.env.PORT || port, () => {
  console.log(`app listening at http://localhost:${port}`)
})