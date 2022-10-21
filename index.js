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
        const studentsInfoCollection = client.db('Student').collection('student-info');
        app.post('/student-info', async (req, res) => {
            const newStudentInfo = req.body;
            const result = await studentsInfoCollection.insertOne(newStudentInfo);
            res.send(result);
        });

        app.get('/student-info', async (req, res) => {
            const query = {};
            const cursor = studentsInfoCollection.find(query);
            const studentsInfo = await cursor.toArray();
            res.send(studentsInfo)
        });
        app.get('/student-info/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const studentsInfo = await studentsInfoCollection.findOne(query);
            res.send(studentsInfo);
        });

        app.put('/student-info/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updatedDoc = {
                $set: {
                    name: data.name
                }
            };
            const result = await studentsInfoCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.delete('/student-info/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentsInfoCollection.deleteOne(query);
            res.send(result);
        });

    }
    finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send(' studentsInfo Server Running well!')
})

app.listen(port, () => {
    console.log(`Hello from studentsInfo CRUD Operation MongoDB Server ${port}`)
})