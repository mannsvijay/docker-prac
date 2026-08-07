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

const User = require("./models/User");

app.get("/add-user", async (req, res) => {
  try {
    const user = new User({
      name: "Manan Vijay",
      email: "manan@gmail.com"
    });

    await user.save();

    res.send("User Added Successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});