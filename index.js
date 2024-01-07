const express = require("express");
const https = require("https");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const patches = require("./routes/patches");
const users = require("./routes/users");

const app = express();
const router = express.Router();

const privateKey = fs.readFileSync("key.pem", "utf8");
const certificate = fs.readFileSync("cert.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

require("dotenv").config({ path: "./config.env" });

// MongoDB Atlas connection string
const atlasConnectionString = `mongodb+srv://jmart163:${process.env.PASSWORD}@synth-builds.7vv4zqz.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(atlasConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Additional logging for route access
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Use cors middleware with default options
const corsOptions = {
  origin: 'https://localhost:5173/',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // enable set cookie
  optionsSuccessStatus: 204,
};
app.use(cors({ options: corsOptions, credentials: true }));


app.use(express.json());
app.use("/api/patches", patches);
app.use("/api/users", users);

const port = 3000;

const httpsServer = https.createServer(credentials, app);



httpsServer.listen(port, () => {
  console.log(`Server running at https://localhost:${port}`);
  console.log("MongoDB Atlas connection string:", atlasConnectionString);
});

app.get("/", (req, res) => {
  console.log("GET / requested");
  res.json("working");
});
