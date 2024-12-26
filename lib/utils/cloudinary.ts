export async function uploadToCloudinary(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('file', audioBlob);
  formData.append('upload_preset', 'voices_recordings');
  formData.append('resource_type', 'audio');

  try {
    console.log('Starting Cloudinary upload...');
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dzgqmck8k/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload error:', errorData);
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    console.log('Upload successful:', data);
    return data.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
} 