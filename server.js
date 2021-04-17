const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const port = 1929

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xzynl.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log(err);
    const serviceCollection = client.db(`${process.env.DATABASE}`).collection("services");
    const orderCollection = client.db(`${process.env.DATABASE}`).collection("orders");
    const reviewCollection = client.db(`${process.env.DATABASE}`).collection("reviews");
    // Add Booking
    app.post('/addBooking', (req, res) => {
        orderCollection.insertOne(req.body)
            .then(result => res.send(result.insertedCount > 0))
    })
    // Add Booking
    app.post('/addReview', (req, res) => {
        reviewCollection.insertOne(req.body)
            .then(result => res.send(result.insertedCount > 0))
    })
    // Get Orderlist of User
    app.post('/orderList', (req, res) => {
        console.log(req.body);
        orderCollection.find({ 'booking.email': req.body.email })
            .toArray((err, docs) => res.send(docs))
    })
    // Get Orderlist of User
    app.post('/fullOrderList', (req, res) => {
        console.log(req.body);
        orderCollection.find({ 'booking.email': req.body.email })
            .toArray((err, docs) => res.send(docs))
    })
    // Get Reviews
    app.get('/reviews', (req, res) => {
        console.log('review req recieved')
        reviewCollection.find().toArray((err, docs) => res.send(docs))
    })
});
app.listen(process.env.PORT || port)