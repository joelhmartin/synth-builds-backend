const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.KEY,
  secretAccessKey: process.env.SECRET,
  region: process.env.REGION
});

const uploadFile = (fileName) => {
  const fileContent = fs.readFileSync(fileName);

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: fileContent
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, function(err, data) {
      if (err) {
        reject(err);
      }
      resolve(data.Location);
    });
  });
};

module.exports = {
  uploadFile
};
