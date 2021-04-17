const express = require('express')
const cors = require('cors')
const fs = require('fs')
const MongoClient = require('mongodb').MongoClient;
const fileupload = require('express-fileupload')
require('dotenv').config()
const port = 1929

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('serviceimg'))
app.use(fileupload())
// app.use(fileUpload({
//     useTempFiles: true,
//     tempFileDir: '/tmp/'
// }));

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
    const adminsCollection = client.db(`${process.env.DATABASE}`).collection("admins");

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
        const email = req.body.email
        adminsCollection.find({ email: email })
            .toArray((err, docs) => {
                if (docs.length > 0) {
                    orderCollection.find()
                        .toArray((err, docs) => res.send(docs))
                } else {
                    orderCollection.find({ 'booking.email': email })
                        .toArray((err, docs) => res.send(docs))
                }
            })

    })
    // Add A Service
    app.post('/addAService', (req, res) => {
        console.log('service is adding..')
        const file = (req.files.file)
        const service = req.body.service
        const description = req.body.description
        const newImg = file.data;
        const encImg = newImg.toString('base64');

        const image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };
        serviceCollection.insertOne({ sevice, description, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    // Get Reviews
    app.get('/reviews', (req, res) => {
        console.log('review req recieved')
        reviewCollection.find().toArray((err, docs) => res.send(docs))
    })
    // Get Services
    app.get('/services', (req, res) => {
        serviceCollection.find()
            .toArray((err, docs) => res.send(docs))
    })

    // Check Admin
    app.post('/checkAdmin', (req, res) => {
        const email = req.body.email
        adminsCollection.find({ email: email })
            .toArray((err, docs) => {
                res.send(docs.length > 0)
            })
    })
});
app.listen(process.env.PORT || port)