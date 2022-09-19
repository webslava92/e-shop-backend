require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const models = require("./models/models");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload')
const router = require("./routes/index");
const errorMiddleware = require("./middleware/errorMiddleware");
const path = require('path');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(fileUpload({}));
app.use("/api", router);

app.use(errorMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
