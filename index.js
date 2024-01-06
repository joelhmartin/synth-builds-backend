const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
const router = express.Router();
const cors = require("cors");
const mongoose = require("mongoose");
const patches = require("./routes/patches");
const users = require("./routes/users");
const url = "mongodb://localhost/patches"; // Change this to /SynthSiteDB
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
  .catch((err) => console.error("MongoDB connection error:", err));

const port = 3000;

// Use cors middleware with default options
app.use(cors());
app.use(express.json());
app.use("/api/patches", patches);
app.use("/api/users", users);

// Additional logging for route access
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  console.log("GET / requested");
  res.json('working');
});

// HTTPS setup with self-signed certificate
const privateKeyPath = './key.pem'; // Replace with the actual path to your key.pem
const certificatePath = './cert.pem'; // Replace with the actual path to your cert.pem

const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Server running at https://localhost:${port}`);
  console.log("MongoDB Atlas connection string:", atlasConnectionString);
});
