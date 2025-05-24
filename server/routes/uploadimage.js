const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const FormData = require('form-data');

module.exports = async function uploadImageFromUrl(req, res) {
  const { imageUrl } = req.body;
  console.log('Received imageUrl:', imageUrl);

  // Check for missing or invalid imageUrl
  if (!imageUrl || typeof imageUrl !== 'string' || !/^https?:\/\//.test(imageUrl)) {
    console.error('Invalid or missing imageUrl:', imageUrl);
    return res.status(400).json({ error: 'A valid imageUrl must be provided (http/https).' });
  }

  try {
    // Try fetching the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error('Failed to fetch image from URL:', imageUrl, 'Status:', response.status);
      return res.status(400).json({ error: 'Failed to fetch image from the provided URL.' });
    }
    const buffer = await response.buffer();
    if (!buffer || buffer.length === 0) {
      console.error('Fetched image buffer is empty.');
      return res.status(400).json({ error: 'Fetched image is empty or invalid.' });
    }
    console.log('Fetched image, buffer size:', buffer.length);

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
      console.error('Cloudinary upload failed:', data);
      return res.status(500).json({ error: data.error?.message || 'Error uploading to Cloudinary' });
    }

    if (!data.secure_url) {
      console.error('Cloudinary did not return a secure_url:', data);
      return res.status(500).json({ error: 'Cloudinary did not return a valid image URL.' });
    }

    console.log('Image uploaded to Cloudinary:', data.secure_url);
    return res.json({ secure_url: data.secure_url });
  } catch (error) {
    console.error('Unexpected error uploading image from URL:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
};