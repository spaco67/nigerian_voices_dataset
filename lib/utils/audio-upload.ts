import { getUploadUrl, getUploadPreset } from '@/lib/cloudinary/client';

export async function uploadAudioToCloudinary(audioBlob: Blob): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', audioBlob);
    formData.append('upload_preset', getUploadPreset() || '');
    formData.append('resource_type', 'auto');

    const response = await fetch(getUploadUrl(), {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Audio upload error:', error);
    throw new Error('Failed to upload audio');
  }
} 