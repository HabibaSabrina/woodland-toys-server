const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// middlewire
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lcauzmf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      const toysCollection = client.db("woodlandToy").collection("toys")

      app.get('/toys',async(req,res) =>{
        let query ={}
        console.log(req.query?.sellerEmail)
        if(req.query?.sellerEmail){
          query = {sellerEmail: req.query.sellerEmail}
        }
        const cursor = toysCollection.find(query).limit(20);
        const result = await cursor.toArray();
        res.send(result)
      })
      app.get('/toys/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const toy = await toysCollection.findOne(query);
        res.send(toy);
      })
      app.post('/toys',async(req,res) =>{
        const toy = req.body;
        const result = await toysCollection.insertOne(toy);
        res.send(result)
      })
      app.delete('/toys/:id', async(req,res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await toysCollection.deleteOne(query)
        res.send(result);
      })
      app.put('/toys/:id', async(req,res)=>{
        const id = req.params.id;
        const toy = req.body;
        console.log(toy, id)
        const filter = {_id: new ObjectId(id)};
        const options = {upsert: true}
        const updatedToy= {
          $set:{
            toyName:toy.toyName,
            toyPhoto:toy.toyPhoto,
            sellerName: toy.sellerName,
            sellerEmail: toy.sellerEmail,
            subCategory: toy.subCategory,
            ratings:toy.ratings,
            price: toy.price,
            quantity: toy.quantity,
            description: toy.description
          }
        }
        const result = await toysCollection.updateOne(filter, updatedToy, options)
        res.send(result)
      })
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("toy server is running")
})

app.listen(port, ()=>{
    console.log(`Running on port ${port}`)
})