const axios = require('axios');

const proxyImage = async (req, res) => {
  try {
    const imageUrl = req.query.url;
    
    if (!imageUrl) {
      return res.status(400).send('Image URL is required');
    }
    
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream'
    });
    
    res.set('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).send('Failed to proxy image');
  }
};

module.exports = proxyImage;
