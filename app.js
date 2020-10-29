require("dotenv").config();
const express = require("express");
const cors = require("cors");
const auth = require("./src/routes/auth");
const admin = require("./src/routes/admin");
const video = require("./src/routes/video");
const user = require("./src/routes/user");
const errorHandler = require("./src/middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", auth);
app.use("/admin", admin);
app.use("/videos", video);
app.use("/users", user);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started at http://localhost:${PORT}`));
