const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const FormData = require('form-data');
require('dotenv').config();

 async function uploadImageFromUrl(req, res) {
  const { imageUrl } = req.body;

  try {
    // Fetch the image
    const response = await fetch(imageUrl);
    const buffer = await response.buffer();

    // Prepare form data for Cloudinary
    const formData = new FormData();
    formData.append('file', buffer, { filename: 'url-image.jpg' });
    formData.append('upload_preset', 'chronos-hub');

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Basic ${Buffer.from(`${process.env.CLOUDINARY_API_KEY}:${process.env.CLOUDINARY_API_SECRET}`).toString('base64')}`
      }
    });

    const data = await cloudinaryResponse.json();
    return res.json({ secure_url: data.secure_url });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ error: 'Failed to upload image' });
  }
};

module.exports = uploadImageFromUrl;