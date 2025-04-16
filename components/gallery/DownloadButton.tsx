import { FC, useState, useEffect } from 'react';
import { DownloadButtonProps } from '@/types/gallery/download-button.types';
import { useTranslations } from 'next-intl';
import { config } from '@/app/config';

const DownloadButton: FC<DownloadButtonProps> = ({
                                                   imageId,
                                                   isLoading: externalIsLoading,
                                                   className = '',
                                                   label,
                                                   variant = 'default',
                                                   onDownloadComplete,
                                                   onDownloadError,
                                                   onDownloadStart,
                                                   disabled = false,
                                                   downloadUrl,
                                                   trackAnalytics = true,
                                                   buttonProps = {}
                                                 }) => {
  const t = useTranslations('Common');
  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const isDev = config.isDevelopment;

  // Use external loading state if provided, otherwise use internal state
  const isLoading = externalIsLoading !== undefined ? externalIsLoading : internalIsLoading;

  // Use provided label or default translation
  const buttonLabel = label || t('download');
  const loadingText = t('processing');

  // Reset success state after showing success feedback
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (downloadSuccess) {
      timeout = setTimeout(() => {
        setDownloadSuccess(false);
      }, 2000);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [downloadSuccess]);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Don't proceed if already loading or disabled
    if (isLoading || disabled) return;

    // Call onDownloadStart callback if provided
    if (onDownloadStart) {
      onDownloadStart();
    }

    // Only manage loading state internally if not controlled externally
    if (externalIsLoading === undefined) {
      setInternalIsLoading(true);
    }

    try {
      if (isDev) {
        console.log(`Initiating download for image: ${imageId}`);
      }

      // Use custom download URL if provided, otherwise use the API route
      const downloadPath = downloadUrl || `/api/download-file/${imageId}`;

      // Direct file download through Next.js API
      window.location.href = downloadPath;

      // Track analytics if enabled
      if (trackAnalytics) {
        // Dispatch custom event for tracking
        window.dispatchEvent(new CustomEvent('image-downloaded', {
          detail: { imageId, timestamp: Date.now() }
        }));
      }

      // Set success state for UI feedback
      setDownloadSuccess(true);

      // Fire success callback if provided
      if (onDownloadComplete) {
        // Small delay to ensure download starts before callback
        setTimeout(() => {
          onDownloadComplete();
        }, 500);
      }
    } catch (error) {
      console.error('Download failed:', error);

      // Fire error callback if provided
      if (onDownloadError && error instanceof Error) {
        onDownloadError(error);
      }
    } finally {
      // Only manage loading state internally if not controlled externally
      if (externalIsLoading === undefined) {
        // Add slight delay to show loading state
        setTimeout(() => {
          setInternalIsLoading(false);
        }, 1000);
      }
    }
  };

  // Render icon-only variant
  if (variant === 'icon') {
    return (
      <button
        onClick={handleDownload}
        disabled={isLoading || disabled}
        className={`rounded-full p-2 bg-white text-gray-900 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ${className}`}
        aria-label={buttonLabel}
        {...buttonProps}
      >
        {isLoading ? <LoadingIcon /> : downloadSuccess ? <SuccessIcon /> : <DownloadIcon />}
      </button>
    );
  }

  // Render text-only variant
  if (variant === 'text') {
    return (
      <button
        onClick={handleDownload}
        disabled={isLoading || disabled}
        className={`text-blue-600 hover:text-blue-800 font-medium focus:outline-none ${className}`}
        {...buttonProps}
      >
        {isLoading ? loadingText : downloadSuccess ? t('downloaded') : buttonLabel}
      </button>
    );
  }

  // Handle primary variant
  if (variant === 'primary') {
    return (
      <button
        onClick={handleDownload}
        disabled={isLoading || disabled}
        className={`w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-center items-center ${className}`}
        {...buttonProps}
      >
        {isLoading ? (
          <>
            <LoadingIcon className="mr-2 w-4 h-4 text-white" />
            <span>{loadingText}</span>
          </>
        ) : downloadSuccess ? (
          <>
            <SuccessIcon className="mr-2 w-4 h-4" />
            <span>{t('downloaded')}</span>
          </>
        ) : (
          <>
            <DownloadIcon className="mr-2 w-4 h-4" />
            <span>{buttonLabel}</span>
          </>
        )}
      </button>
    );
  }

  // Render default variant
  return (
    <button
      onClick={handleDownload}
      disabled={isLoading || disabled}
      className={`w-full py-2 px-4 bg-white text-gray-900 text-sm font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 flex justify-center items-center ${className}`}
      {...buttonProps}
    >
      {isLoading ? (
        <>
          <LoadingIcon className="mr-2 w-4 h-4" />
          <span>{loadingText}</span>
        </>
      ) : downloadSuccess ? (
        <>
          <SuccessIcon className="mr-2 w-4 h-4" />
          <span>{t('downloaded')}</span>
        </>
      ) : (
        <>
          <DownloadIcon className="mr-2 w-4 h-4" />
          <span>{buttonLabel}</span>
        </>
      )}
    </button>
  );
};

// Download icon SVG component
const DownloadIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
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

// Loading spinner icon component
const LoadingIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

// Success icon component
const SuccessIcon = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default DownloadButton;