const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
// middleware
app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9yghi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

// const uri = "mongodb+srv://taskStore:wEuCBOfQSxjef3Yy@cluster0.9yghi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const database = client.db('taskManagement');
        const taskCollection = database.collection('task');
        // const userCollection = client.db('taskDB').collection('users');


        app.get('/task', async (req, res) => {
            const cursor = taskCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await taskCollection.findOne(query);
            res.send(result);
        })

        app.post('/task', async (req, res) => {
            const newtask = req.body;
            console.log('Adding new task', newtask)
            const result = await taskCollection.insertOne(newtask);
            res.send(result);
        });

     // Update task status
app.put('/task/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
  
      const result = await tasksCollection.updateOne(
        { _id: new ObjectId(id) }, // Use ObjectId for MongoDB queries
        { $set: { status } }
      );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
  
      res.json({ message: 'Task updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error updating task' });
    }
  });
          

        app.delete('/task/:id', async (req, res) => {
            console.log('going to delete', req.params.id);
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        })


    } finally {
        
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Task Manager')
})

app.listen(port)
