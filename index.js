const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json()) 


console.log(process.env.DB_PASS)
console.log(process.env.DB_USER)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pb63j1a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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
    // await client.connect();


    const servicesCollection = client.db('carDoctor').collection('services');
    const checkoutCollection = client.db('carDoctor').collection('checkout')

    app.get('/services' ,async(req,res)=>{
      const cursor = servicesCollection.find()
      const result =await cursor.toArray()
      res.send(result)
      console.log(result)
    })


    app.get('/services/:id' , async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)} 

      const options = { 
        // Include only the `title` and `imdb` fields in the returned document
        projection: { title: 1, price: 1 ,service_id: 1},
      }; 

      const result = await servicesCollection.findOne(query,options);
      res.send(result);
    })

    app.get('/checkout' , async(req,res) =>{ 
      console.log(req.query.email)
      let query = {};
      if(req.query.email){
        query = {email: req.require.email}
      }
      const result =await checkoutCollection.find().toArray()
      res.send(result)
    })

    app.post('/checkout',async(req,res) =>{
      const checkout = req.body;
      console.log(checkout)
      const result = await checkoutCollection.insertOne(checkout)
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('car is running')
})

app.listen(port,() =>{
    console.log(`car doctor server is running on port ${port}`)
})