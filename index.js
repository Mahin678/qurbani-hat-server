const express = require("express");
const cors = require("cors")
const bodyPerser = require("body-parser");
const { MongoClient,ObjectId } = require('mongodb');
const app = express();
const port = 3000;
let Vimeo = require('vimeo').Vimeo;
require("dotenv").config();
app.use(cors());
app.use(bodyPerser.json());
// db connection 

// const uri = "mongodb+srv://MyDbUser:gorurhat@cluster0.bssu4.mongodb.net/cowdb?retryWrites=true&w=majority";
const uri = "mongodb+srv://volunteer-network-main:volunteer-network-main123@cluster0.odwvb.mongodb.net/qurbanihat?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


client.connect(err => {
  const cowCollection = client.db("qurbanihat").collection("cow");
  // const serviceCollection = client.db("qurbanihat").collection("cow");
  // Post
  app.post("/addCow",(req,res)=>{
      const cow = req.body;
      cowCollection.insertOne(cow)
      .then(result=>{
        res.send(result)
      })
  });
  app.post("/addService",(req,res)=>{
      const service = req.body;
      serviceCollection.insertOne(service)
      .then(result=>{
        res.send("success")
      })
      
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
    // cow get by user id
    app.get("/userCow/:email",(req,res)=>{
      cowCollection.find({email:req.params.email})
        .toArray((err,data)=>{
          res.send(data)  
          // console.log(data)
        })
    })
  

  // get all service
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
        $set: req.body
      })
      .then(result=> 
          {
            if(result.modifiedCount){
              res.send(200)
            }
          }
        )
  })
  //Delete
  app.delete("/deleteCow/:id",(req,res)=>{
    cowCollection.deleteOne({_id:ObjectId(req.params.id)})
      .then(result=>res.send(result))
  })
  app.delete("/deleteService/:id",(req,res)=>{
    serviceCollection.deleteOne({_id:ObjectId(req.params.id)})
      .then(result=>res.send("Succesfully deleted"))
  })
}

);





app.listen(process.env.PORT || port, () => {
  console.log(`app listening at http://localhost:${port}`)
})