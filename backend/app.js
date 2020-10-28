require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auth = require("./src/routes/auth");
const user = require("./src/routes/user");
const post = require("./src/routes/post");
const connectToDb = require("./src/utils/db");
const errorHandler = require("./src/middlewares/errorHandler");

//App config
const app = express();
const port = process.env.PORT || 8001

// const pusher = new Pusher({
//     app_id: process.env.app_id,
//     key: process.env.key,
//     secret: process.env.secret,
//     cluster: "mt1",
//     useTLS: true
//   });

connectToDb();
app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", auth);
app.use("/api/v1/users", user);
app.use("/api/v1/posts", post);

app.use(errorHandler);

app.listen(
  port,
  console.log(`server started in ${process.env.NODE_ENV} mode at port ${port}`)
);
