const express = require("express");
const app = express();
const router = express.Router();
const cors = require("cors");
const mongoose = require("mongoose");
const patches = require("./routes/patches");
const users = require("./routes/users");
require("dotenv").config({ path: "./config.env" });

// MongoDB Atlas connection string
const atlasConnectionString =
  `mongodb+srv://jmart163:${process.env.PASSWORD}@synth-builds.7vv4zqz.mongodb.net/patches?retryWrites=true&w=majority`;

mongoose
  .connect(atlasConnectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB connection error:", err));

const port = 3000;

const allowedOrigins = ['https://localhost:5173', 'https://synth-builds-7xpf3mb4j-joelhmartin.vercel.app/']
// Use cors middleware with default options
app.use(cors({
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));



app.use(express.json());
app.use("/api/patches", patches);
app.use("/api/users", users);
app.options('*', cors());

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log("MongoDB Atlas connection string:", atlasConnectionString);
});

// Additional logging for route access
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  console.log("GET / requested");
  res.json('working');
});


