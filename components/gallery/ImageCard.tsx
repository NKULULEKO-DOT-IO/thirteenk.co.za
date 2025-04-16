import { FC, useState } from 'react';
import Image from 'next/image';
import { useDownload } from '@/hooks/use-download';
import { ImageCardProps } from '@/types/gallery/image.types';
import { useTranslations } from 'next-intl';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';

const EnhancedImageCard: FC<ImageCardProps> = ({
                                                 image,
                                                 priority = false,
                                                 downloadLabel,
                                                 className = '',
                                                 onClick,
                                                 showMetadata = false
                                               }) => {
  const t = useTranslations('Common');
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { downloadImage, isLoading } = useDownload();

  // Ensure HTTPS for image URLs
  const thumbnailUrl = image.thumbnail_url.replace(/^http:/, 'https:');

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Create additional tracking data if available
    const trackingData = {
      imageMetadata: !!image.metadata,
      hasCategories: image.categories?.length && image.categories?.length > 0,
      hasAltText: !!image.alt_text,
      referrer: document.referrer || 'direct',
      viewportSize: `${window.innerWidth}x${window.innerHeight}`
    };

    try {
      await downloadImage(image.id, trackingData);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick(image);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageError = () => {
    console.error(`Failed to load image: ${thumbnailUrl}`);
    setImageError(true);
  };

  const toggleMetadata = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Function to format the date from ISO string
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div
      className={`overflow-hidden rounded-lg bg-white transition-all hover:shadow-lg relative ${isExpanded ? 'row-span-2' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${image.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        {!isImageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSkeleton height="h-full" width="w-full" />
          </div>
        )}

        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center p-4">
              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2 text-sm text-gray-500">{t('imageLoadError') || 'Failed to load image'}</p>
            </div>
          </div>
        ) : (
          <Image
            src={thumbnailUrl}
            alt={image.alt_text || image.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover transition-transform duration-300 hover:scale-105 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            priority={priority}
            unoptimized={true}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}

        {/* Image info overlay */}
        <div
          className={`absolute inset-0 bg-opacity-0 transition-all duration-300 flex flex-col justify-end p-3
            ${isHovered ? 'bg-opacity-40' : ''}`}
        >
          <div className={`transform transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-center text-xs text-white">
                <span>{image.downloads} {t('downloads')}</span>
              </div>

              {/* Metadata toggle button (if metadata available) */}
              {showMetadata && image.metadata && (
                <button
                  onClick={toggleMetadata}
                  className="hidden  md:flex items-center justify-center p-2 bg-white rounded-full hover:bg-gray-100 mr-2"
                  aria-label={isExpanded ? "Hide metadata" : "Show metadata"}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d={isExpanded ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                  </svg>
                </button>
              )}

              {/* Desktop download button */}
              <button
                onClick={handleDownload}
                disabled={isLoading}
                aria-label={downloadLabel}
                className="hidden cursor-pointer md:flex items-center justify-center p-2 bg-white rounded-full hover:bg-gray-100"
              >
                <DownloadIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile download button - always visible */}
        <button
          onClick={handleDownload}
          disabled={isLoading}
          className="md:hidden absolute bottom-3 right-3 rounded-full p-2 bg-white text-gray-900 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label={downloadLabel}
        >
          <DownloadIcon />
        </button>

        {/* Metadata badges - subtle indicators of available metadata */}
        {isImageLoaded && showMetadata && !isExpanded && (
          <div className="absolute top-2 right-2 flex space-x-1">
            {image.metadata?.camera_make && (
              <span className="bg-black bg-opacity-50 rounded-full w-6 h-6 flex items-center justify-center" title="Camera info available">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
            )}
            {image.metadata?.location && (
              <span className="bg-black bg-opacity-50 rounded-full w-6 h-6 flex items-center justify-center" title="Location data available">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
            )}
            {image.author && (
              <span className="bg-black bg-opacity-50 rounded-full w-6 h-6 flex items-center justify-center" title="Author information available">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded metadata section */}
      {isExpanded && showMetadata && image.metadata && (
        <div className="p-4 text-sm border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            {/* Left column */}
            <div>
              {image.author && (
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-700">Author</h4>
                  <p>{image.author}</p>
                </div>
              )}

              {image.metadata.taken_at && (
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-700">Date Taken</h4>
                  <p>{formatDate(image.metadata.taken_at)}</p>
                </div>
              )}

              {image.metadata.camera_make && (
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-700">Camera</h4>
                  <p>{image.metadata.camera_make} {image.metadata.camera_model}</p>
                </div>
              )}

              {image.metadata.lens_info && (
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-700">Lens</h4>
                  <p>{image.metadata.lens_info}</p>
                </div>
              )}
            </div>

            {/* Right column */}
            <div>
              {image.metadata.focal_length && (
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-700">Settings</h4>
                  <p>
                    {image.metadata.focal_length}mm
                    {image.metadata.aperture && `, f/${image.metadata.aperture}`}
                    {image.metadata.exposure_time && `, ${image.metadata.exposure_time}s`}
                    {image.metadata.iso && `, ISO ${image.metadata.iso}`}
                  </p>
                </div>
              )}

              {image.copyright && (
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-700">Copyright</h4>
                  <p>{image.copyright}</p>
                </div>
              )}

              {image.license_type && (
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-700">License</h4>
                  <p>{image.license_type}</p>
                </div>
              )}

              {image.metadata.location && (
                <div className="mb-3">
                  <h4 className="font-semibold text-gray-700">Location</h4>
                  <p>
                    {image.metadata.location.latitude.toFixed(6)},
                    {image.metadata.location.longitude.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Color palette */}
          {image.metadata.dominant_colors && image.metadata.dominant_colors.length > 0 && (
            <div className="mt-3">
              <h4 className="font-semibold text-gray-700 mb-1">Color Palette</h4>
              <div className="flex space-x-2">
                {image.metadata.dominant_colors.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={toggleMetadata}
            className="mt-3 text-blue-600 hover:text-blue-800 text-xs flex items-center"
          >
            <span>Hide details</span>
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

// Download icon component
const DownloadIcon: FC = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
    <g>
      <path
        opacity="0.5"
        d="M3 15C3 17.8284 3 19.2426 3.87868 20.1213C4.75736 21 6.17157 21 9 21H15C17.8284 21 19.2426 21 20.1213 20.1213C21 19.2426 21 17.8284 21 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 3V16M12 16L16 11.625M12 16L8 11.625"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export default EnhancedImageCard;