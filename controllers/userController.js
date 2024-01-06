const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = reqire("multer-s3");

const s3 = new AWS.S3({
  accessKeyId: process.env.KEY,
  secretAccessKey: process.env.SECRET,
  region: process.env.REGION,
});

const upload = () =>
  multer({
    storage: multerS3({
      s3,
      bucket: process.env.BUCKET_NAME,
      metadata: function (req, file, callback) {
        callback(null, { fieldName: file.fieldname });
      },
      key: function (req, file, callback) {
        callback(null, "image.jpeg");
      },
    }),
  });

exports.setSynthPhoto = (req, res, next) => {
  console.log(req.files);

  uploadSingle = upload().single("image-upload");

  uploadSingle(req, res, (err) => {
    if (err)
      return res.status(400).json({ success: false, message: err.message });

    console.log(req.files);

    res.status(200).json({ data: req.files });
  });
};
