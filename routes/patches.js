const express = require("express");
const router = express.Router();
const { Patch, validatePatch } = require("../models/patch");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Set the destination folder for uploaded files
const AWS = require("aws-sdk");
const fs = require("fs");

router.get("/", async (req, res) => {
  try {
    // Check if there's a search query parameter
    const searchQuery = req.query
    console.log(searchQuery)
    let patches;

    const queryConditions = [];

    if (searchQuery.searchText) {
      queryConditions.push({
        $or: [
          { song: { $regex: searchQuery.searchText, $options: "i" } },
          { synth: { $regex: searchQuery.searchText, $options: "i" } },
          { genre: { $regex: searchQuery.searchText, $options: "i" } },
          { producer: { $regex: searchQuery.searchText, $options: "i" } },
          { description: { $regex: searchQuery.searchText, $options: "i" } },
        ],
      });
    }

    if (searchQuery.producer) {
      queryConditions.push({ producer: { $regex: searchQuery.producer, $options: "i" } });
    }

    if (searchQuery.genre) {
      queryConditions.push({ genre: { $regex: searchQuery.genre, $options: "i" } });
    }

    if (queryConditions.length > 0) {
      // If there are conditions, perform a $or query
      patches = await Patch.find({ $or: queryConditions });
    } else {
      // If no conditions, fetch all patches
      patches = await Patch.find();
    }

    res.send(patches);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching patches from the database.");
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  
  AWS.config.update({
    accessKeyId: process.env.KEY,
    secretAccessKey: process.env.SECRET,
    region: process.env.REGION,
  });

  const s3 = new AWS.S3();

  const image = req.file;

  // Read the file from the disk
  const imageData = fs.readFileSync(image.path);

  // Create a unique file name for the S3 object
  const imageName = `${Date.now()}-${image.originalname}`;

  try {
    // Set the S3 upload parameters
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: imageName,
      Body: imageData,
    };
    // Upload the file to the S3 bucket
    const result = await s3.upload(params).promise();

    const { error } = validatePatch(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let patch = new Patch({
      file: result.Location, // Store the S3 object URL in the patch document (result.Location)
      song: req.body.song,
      synth: req.body.synth,
      genre: req.body.genre,
      producer: req.body.producer,
      description: req.body.description,
    });

    await patch.save();
    res.send(patch);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving patch to the database.");
  }
});

router.delete("/:id", (req, res) => {
  if (!patch)
    return res.status(404).send("The patch with the given ID was not found.");
  const patch = Patch.findByIdAndRemove(req.params.id);
  res.send(patch);
});

router.get("/:id", async (req, res) => {
  const patch = await Patch.findById(req.params.id);
  if (!patch)
    return res.status(404).send("The patch with the given ID was not found.");
  res.send(patch);
});

module.exports = router;
