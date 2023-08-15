const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const knex = require("knex");
const { handleRegister, handleSignin } = require("./controllers/auth");
const {
  handleProfileGet,
  handleImage,
  handleApiCall,
} = require("./controllers/user");

//db
const db = knex({
  client: "pg",
  connection: process.env.POSTGRES_URI,
});

const app = express();

const whitelist = ["http://localhost:3001"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

// middleware
app.use(morgan("combined"));
app.use(cors(corsOptions));
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.json({ message: "This is working" });
});

app.post("/signin", (req, res) => handleSignin(req, res, db, bcrypt));
app.post("/register", (req, res) => handleRegister(req, res, db, bcrypt));
app.get("/profile/:id", (req, res) => handleProfileGet(req, res, db));

app.put("/image", (req, res) => handleImage(req, res, db));
app.post("/imageurl", (req, res) => handleApiCall(req, res));

// set port
app.listen(3000, () => {
  console.log("app is running on port 3000");
});
