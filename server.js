const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

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
    const orederCollection = client.db(`${process.env.DATABASE}`).collection("orders");
    // perform actions on the collection object

    // Add Booking
    app.post('/addBooking', (req, res) => {
        orederCollection.insertOne(req.body)
            .then(result => res.send(result.insertedCount > 0))
        // .then(data => res.send('true'))
    })

    // Get Orderlist of User
    app.post('/orderList', (req, res) => {
        console.log(req.body);
        orederCollection.find({ email: req.body.email })
            .toArray((err, docs) => res.send(docs))
    })
    // client.close();
});




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})