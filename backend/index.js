const express = require("express");
const { addUsers,getUser } = require("./controller/user");
require("dotenv").config();
require("./mysql");
const cors = require('cors');
const bodyParser  = require('body-parser');
const port = process.env.PORT || 8080;

// Set express app
const app = express();
app.use(express.json());
app.use(bodyParser.json())
app.use(cors());

// add new users with activity
app.post("/users", addUsers);

// get users
app.get('/users',getUser)


// listen app
app.listen(port, () => {
  console.log("App started at 8080.");
});
