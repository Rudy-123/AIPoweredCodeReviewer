const express = require("express");
const airoutes = require("./Routes/ai.routes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test root route
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// API routes
app.use("/ai", airoutes);

module.exports = app;
