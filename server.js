const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// using for allowing cross site request from anywhere
app.use(cors());

// Getting the mongodb connection string from environment varaible
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });

//Creating a connection object of mongoose
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("mongodb connected succesfully");
});

//Base route
app.get("/", (req, res) => {
  res.send("Coursepedia on server");
});

const userRouter = require("./Routes/UserRoute");

//To Route any incoming user request
app.use("/user", userRouter);

const courseRouter = require("./Routes/CourseRoute");

//To Route any incoming course request
app.use("/course", courseRouter);

//Allowing the server to listen to a specific port, Default 3000 if not provided
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on: ${port}`);
});
