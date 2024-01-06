const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const mongoose = require("mongoose");
const patches = require("./routes/patches");
const users = require("./routes/users");
const url = "mongodb://localhost/patches"; //Change this to /SynthSiteDB
require("dotenv").config({ path: "./config.env" });

// MongoDB Atlas connection string
const atlasConnectionString =
  `mongodb+srv://jmart163:${process.env.PASSWORD}@synth-builds.7vv4zqz.mongodb.net/?retryWrites=true&w=majority`;


mongoose
  .connect(atlasConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.log(err));


const port = process.env.PORT || 3000;


// Use cors middleware with default options
app.use(cors());
app.use(express.json());
app.use("/api/patches", patches);
app.use("/api/users", users);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get('/', (req, res) => res.json('working'))
