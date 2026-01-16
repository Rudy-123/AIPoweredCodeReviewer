const express = require("express");
const airoutes = require("./Routes/ai.routes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/ai", airoutes);
app.use("/", airoutes);

module.exports = app;
