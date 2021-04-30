require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDatabase");
const authRouter = require("./routes");

const PORT = process.env.PORT || 4000;

// initializing express app
const app = express();

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// connect database
connectDB();

// setup routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
