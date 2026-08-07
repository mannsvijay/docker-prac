const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(
  "mongodb://admin:password@localhost:27017/user-account?authSource=admin"
)
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.log("MongoDB Error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from Node.js Backend!"
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});