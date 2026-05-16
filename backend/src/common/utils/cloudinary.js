const cloudinary = require('cloudinary').v2;
const { cloudinary: cfg } = require('../../config');

cloudinary.config({
  cloud_name: cfg.cloudName,
  api_key: cfg.apiKey,
  api_secret: cfg.apiSecret,
  secure: true
});

const uploadBuffer = (buffer, folder = 'products') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    stream.end(buffer);
  });

module.exports = { uploadBuffer, cloudinary };
