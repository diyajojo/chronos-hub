const fetch = require('node-fetch');
const FormData = require('form-data');

module.exports = async function uploadImageFromUrl(req, res) {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: 'No imageUrl provided' });
  }

  try {
    // Fetch the image as a buffer
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error('Failed to fetch image from URL');
    const buffer = await response.buffer();

    // Prepare form data for Cloudinary
    const formData = new FormData();
    formData.append('file', buffer, { filename: 'url-image.jpg' });
    formData.append('upload_preset', 'chronos-hub');

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch('https://api.cloudinary.com/v1_1/dj3pdnthr/image/upload', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    const data = await cloudinaryResponse.json();
    if (!cloudinaryResponse.ok) {
      throw new Error(data.error?.message || 'Error uploading to Cloudinary');
    }

    return res.json({ secure_url: data.secure_url });
  } catch (error) {
    console.error('Error uploading image from URL:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}; 