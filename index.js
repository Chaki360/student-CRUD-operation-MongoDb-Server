const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.86tbor5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const profileInfoCollection = client.db('Simple-CRUD-real-time-system').collection('ProfileInfo');
        app.post('/profiles', async (req, res) => {
            const newProfile = req.body;
            const result = await profileInfoCollection.insertOne(newProfile);
            res.send(result);
        });

        app.get('/profiles', async (req, res) => {
            const query = {};
            const cursor = profileInfoCollection.find(query);
            const profiles = await cursor.toArray();
            res.send(profiles)
        });
        app.get('/profiles/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const profiles = await profileInfoCollection.findOne(query);
            res.send(profiles);
        });

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send(' CRUD Operation Server Running well!')
})

app.listen(port, () => {
    console.log(`Hello from CRUD Operation MongoDB Server ${port}`)
})