const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nhm74.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("travelDb");
        const elementCollection = database.collection("element");
        const userCollection = database.collection("user");



        //post elements api
        app.post('/elements', async (req, res) => {
            const newUser = req.body;
            const result = await elementCollection.insertOne(newUser)

            console.log('hitting the post', req.body
            );
            console.log('added new user ', result);
            res.json(result);
        })
        //post api
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await userCollection.insertOne(newUser)

            console.log('hitting the post', req.body
            );
            console.log('added new user ', result);
            res.json(result);
        })


        //get element api
        app.get('/elements', async (req, res) => {
            const cursor = elementCollection.find({});
            const elements = await cursor.toArray();
            res.send(elements);
        })
        //get user api 
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const elements = await cursor.toArray();
            res.send(elements);
        })

        //get single api
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const user = await userCollection.findOne(query)
            res.send(user);
        })


        //delete single api
        app.delete('/users/:id', async (req, res) => {


            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            console.log('deleting user with id', result);
            res.json(result)
        })

//
            //update state 
            app.put('/users/:id',async(req,res)=>{
                const id=req.params.id;
                console.log(id)
               
                const filter={_id:ObjectId(id)};
                const options = { upsert: true }; 
                const updateDoc = {
                    $set: {
                        orderStatus:"confirm"
                    },
                  };
                  const result = await userCollection.updateOne(filter,updateDoc,options)
                console.log('updating user ',updateDoc);
                res.json(result)
            })
        



//
        // const result = await usersCollection.insertOne(newUser)
        console.log('connected to database');
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('travel go is running')

})



app.listen(port, () => {
    console.log('running the server on port', port)
})