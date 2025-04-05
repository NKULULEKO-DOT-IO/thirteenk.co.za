/**
 * Helper function to download an image from a URL as a blob
 */
export async function downloadImageAsBlob(imageId: string): Promise<void> {
  try {
    // First, get the download URL from the API
    const response = await fetch(`/api/v1/downloads/${imageId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get download URL: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.download_url;
    
    console.log("Download URL received:", imageUrl);
    
    // Now fetch the actual image as a blob
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }
    
    // Get the image as a blob
    const imageBlob = await imageResponse.blob();
    
    // Determine filename - either from Content-Disposition header or fallback
    let filename = `image-${imageId}.jpg`;
    const contentDisposition = imageResponse.headers.get('content-disposition');
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }
    
    // Create object URL for the blob
    const url = URL.createObjectURL(imageBlob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}