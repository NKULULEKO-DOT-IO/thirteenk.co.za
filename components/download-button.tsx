import { FC, useState } from 'react';

interface DownloadButtonProps {
 imageId: string;
 className?: string;
}

const DownloadButton: FC<DownloadButtonProps> = ({ imageId, className = '' }) => {
 const [isDownloading, setIsDownloading] = useState(false);

 const handleDownload = async (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();

  setIsDownloading(true);
  try {
   // In a real implementation, this would call the API
   // For now, we'll simulate a download delay
   await new Promise(resolve => setTimeout(resolve, 1000));

   // Create a simulated download (in production, this would use the actual URL)
   const link = document.createElement('a');
   link.href = `/api/download/${imageId}`;
   link.setAttribute('download', `image-${imageId}.jpg`);
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
  } catch (error) {
   console.error('Download failed:', error);
  } finally {
   setIsDownloading(false);
  }
 };

 return (
   <button
     onClick={handleDownload}
     disabled={isDownloading}
     className={`w-full py-2 px-4 bg-white text-gray-900 text-sm font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ${className}`}
   >
    {isDownloading ? 'Processing...' : 'Download'}
   </button>
 );
};

export default DownloadButton;