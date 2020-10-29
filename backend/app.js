require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auth = require("./src/routes/auth");
const admin = require("./src/routes/admin");
const video = require("./src/routes/video");
const user = require("./src/routes/user");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['POST', 'PUT', 'GET', 'PATCH','OPTIONS', 'DELETE','HEAD'],
    credentials: false,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
  
    // "preflightContinue": false,
    // "optionsSuccessStatus": 204,
  //   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
   }
app.use(express.json());
app.use(cors());

app.use("/auth", auth);
app.use("/admin", admin);
app.use("/videos", video);
app.use("/users", user);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started at http://localhost:${PORT}`));
