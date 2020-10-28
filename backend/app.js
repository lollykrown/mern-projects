import express from 'express';
import mongoose from 'mongoose';
import Cards from './dbCards.js';
import dbModel from './dbModel.js';
import cors from 'cors'
import dotenv from 'dotenv';
import Pusher from 'pusher';
dotenv.config()

//App config
const app = express();
const port = process.env.PORT || 8001

const pusher = new Pusher({
    app_id: process.env.app_id,
    key: process.env.key,
    secret: process.env.secret,
    cluster: "mt1",
    useTLS: true
  });

//middlewares
app.use(express.json())
app.use(cors());

//DB config
mongoose.connect(process.env.URL, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})
mongoose.connection.once('open', ()=> {
    console.log('db connected')
    
    const changeStream = mongoose.connection.collection('posts').watch();

    changeStream.on('change', (change) => {
        console.log('change triggered on pusher')
        console.log(change);
        console.log('end of change');

        if (change.operationType === 'insert') {
            console.log('Triggering Pusher **IMG UPLOAD***')

            const postDetails = change.fullDocument;
            pusher.trigger('posts', 'inserted', {
                user: postDetails.user,
                capton: postDetails.caption,
                image: postDetails.image
            })
        } else {
            console.log('unknown trigger from pusher')
        }
    })
})

//API Endpoints
app.get('/', (req, res) => {
    res.status(200).send('hello worls')
})

app.post('/tinder/card', (req, res) => {
    const dbCard = req.body;

    Cards.create(dbCard, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else{
            res.status(200).send(data)
        }
    })
})

app.get('/tinder/card', (req, res) => {

    const dbCard = req.body;

    Cards.find({}, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else{
            console.log(data)
            res.status(200).send(data)
        }
    })
})

app.post('/upload', (req, res) => {
    const body = req.body;

    dbModel.create(body, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else{
            console.log(data)
            res.status(200).send(data)
        }
    })
})

app.get('/sync', (req, res) => {
    dbModel.find({}, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else{
            console.log(data)
            res.status(200).send(data)
        }
    })
})

//Listener
app.listen(port, ()=> console.log(`listening on localhost: ${port}`))