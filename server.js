const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())

const port = 5555

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzynl.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err);
    const serviceCollection = client.db(`${process.env.DATABASE}`).collection("services");
    // perform actions on the collection object
    // client.close();
});




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})