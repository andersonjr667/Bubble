const cloudinary = require('cloudinary').v2;
const { cloudinaryUrl } = require('../config');

cloudinary.config({
  secure: true,
  ...(cloudinaryUrl ? { cloudinary_url: cloudinaryUrl } : {})
});

module.exports = cloudinary;
