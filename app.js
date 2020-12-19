require("dotenv").config();
const express = require("express");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require("cors");
const path = require('path')
const MongoStore = require('connect-mongo')(session);
const debug = require('debug')('app:root')

const errorHandler = require("./src/middlewares/errorHandler");

//App config
const app = express();
const port = process.env.PORT || 8001

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
const db = mongoose.connection;

const sessionOptions = {
  saveUninitialized: false,
  resave: false,
  secret: process.env.SECRET,
  cookie: {
    //secure: true,
    path: '/',
    httpOnly: true,
    maxAge: 2592000000 // 30 x 24 x 60 x 60 x 1000sec   //30 days
  },
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  name: '_sid',
}

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // log.info(`Connected to MongoDB: ${db.host}`);
  debug(`Connected to MongoDB: ${db.host}`);
});


// Set up CORS
const corsOptions = {
  origin: ['http://127.0.0.1:3000','http://localhost:3000', 'https://mern-backend.herokuapp.com','https://kay-insta.netlify.app'],
  methods: ['POST', 'PUT', 'GET', 'PATCH', 'OPTIONS', 'DELETE', 'HEAD'],
  credentials: true,
  allowedHeaders: ["Access-Control-Allow-Origin", "Content-Type, Authorization, X-Requested-With"],

  // "preflightContinue": false,
  // "optionsSuccessStatus": 204,
  //   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(session(sessionOptions));

require('./src/config/passport.js')(app);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const authRouter = require("./src/routes/authRoutes")();
const postRouter = require("./src/routes/postRoutes")();
const userRouter = require("./src/routes/userRoutes")();

app.use("/", authRouter);
app.use("/posts", postRouter);
app.use("/users", userRouter);

app.use(errorHandler);

app.listen(
  port,
  debug(`🌎  => server started in ${process.env.NODE_ENV} mode at port ${port}`)
);
