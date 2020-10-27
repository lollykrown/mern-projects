import express from 'express';
import mongoose from 'mongoose';
import Cards from './dbCards.js';
import cors from 'cors'
import dotenv from 'dotenv';
dotenv.config()

//App config
const app = express();
const port = process.env.PORT || 8001
const url = 'mongodb+srv://admin:sd44aCVkFhfoAkAY@mern-projects.lrj6l.mongodb.net/<dbname>?retryWrites=true&w=majority';

//middlewares
app.use(express.json())
app.use(cors());

//DB config
mongoose.connect(process.env.URL, {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
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
            res.status(200).send(data)
        }
    })
})

//Listener
app.listen(port, ()=> console.log(`listening on localhost: ${port}`))