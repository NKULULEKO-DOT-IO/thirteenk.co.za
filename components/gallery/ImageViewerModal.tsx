import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useDownload } from '@/hooks/use-download';
import { ImageData } from '@/types/gallery/image.types';
import { formatFileSize } from '@/utils/utils';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';

interface ImageViewerModalProps {
  /**
   * Image data to display
   */
  image: ImageData | null;

  /**
   * Function to close the modal
   */
  onClose: () => void;
}

const ImageViewerModal: FC<ImageViewerModalProps> = ({ image, onClose }) => {
  const t = useTranslations('Common');
  const { downloadImage, isLoading } = useDownload();
  const [isClosing, setIsClosing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };


  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  // Handle download button click
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!image || isLoading) return;

    try {
      await downloadImage(image.id);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };


  // Reset state when image changes
  useEffect(() => {
    if (image) {
      setImageLoaded(false);
      setImageError(false);
    }
  }, [image]);

  // Don't render if no image
  if (!image) return null;

  // Ensure HTTPS for image URLs
  const thumbnail_url = image.thumbnail_url.replace(/^http:/, 'https:');

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity duration-200 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] bg-white rounded-lg overflow-hidden transition-transform duration-200 ${isClosing ? 'scale-95' : 'scale-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute cursor-pointer top-4 right-4 z-10 p-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 focus:outline-none"
          onClick={handleClose}
          aria-label={t('close')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Download button */}
        <button
          className="absolute cursor-pointer top-4 left-4 z-10 p-2 bg-white bg-opacity-70 rounded-full hover:bg-opacity-100 focus:outline-none"
          onClick={handleDownload}
          disabled={isLoading}
          aria-label={t('download')}
        >
          {isLoading ? (
            <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 3V16M12 16L16 11.625M12 16L8 11.625"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* Image container with loading state */}
        <div className="relative h-[80vh] w-full flex items-center justify-center bg-gray-100">
          {/* Loading skeleton */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSkeleton width="w-full" height="h-full" />
            </div>
          )}

          {/* Error state */}
          {imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xl">{t('imageLoadError') || 'Failed to load image'}</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                onClick={(e) => {
                  e.stopPropagation();
                  setImageError(false);
                  setImageLoaded(false);
                }}
              >
                {t('retry') || 'Retry'}
              </button>
            </div>
          )}

          {/* Actual image */}
          {!imageError && (
            <Image
              src={thumbnail_url}
              alt={image.name}
              className={`object-contain max-h-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              priority
              unoptimized={true}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                console.error(`Failed to load image: ${thumbnail_url}`);
                setImageError(true);
              }}
            />
          )}
        </div>

        {/* Image metadata */}
        <div className="p-4 bg-white">
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-sm bg-gray-100 rounded-md px-3 py-1">
              {formatFileSize(image.file_size)}
            </span>
            <span className="text-sm bg-gray-100 rounded-md px-3 py-1">
              {image.downloads} {t('downloads')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewerModal;