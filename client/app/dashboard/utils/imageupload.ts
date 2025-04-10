// When a user uploads an image from their laptop or phone, it is already a File object, so you can directly upload it to Cloudinary, preview it using URL.createObjectURL(file), or send it to your backend. But when an image is generated using DALL·E, you only get a URL pointing to the image. To handle it like an uploaded file, you first fetch the URL, convert the response into a Blob (which is raw binary data), and then wrap that Blob into a File object. A Blob holds data like images, videos, or audio but can’t be stored or uploaded directly to a database or cloud — it needs to be converted to a File first to be used like any normal uploaded file.






export const handleImageUpload = async (file: File) => {
  try {
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'chronos-hub');

    const response = await fetch(`https://api.cloudinary.com/v1_1/dj3pdnthr/image/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Error uploading to Cloudinary');
    }

    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};
