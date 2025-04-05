'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getImages, ImageData, getTotalDownloads } from '@/lib/api';
import LoadingSkeleton from '@/components/loading-skeleton';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const [images, setImages] = useState<ImageData[]>([]);
  const [totalDownloads, setTotalDownloads] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isHoveredMap, setIsHoveredMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // Fetch images and download count in parallel
        const [imagesResponse, downloadsResponse] = await Promise.all([
          getImages(0, 12, undefined, true),
          getTotalDownloads()
        ]);

        console.log(imagesResponse)

        setImages(imagesResponse.images);
        setTotalDownloads(downloadsResponse.total_downloads);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleMouseEnter = (id: string) => {
    setIsHoveredMap(prev => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setIsHoveredMap(prev => ({ ...prev, [id]: false }));
  };

  const API_BASE_URL = 'https://thirteenkapi-service-227629318480.us-central1.run.app/api/v1';

  // Ensure HTTPS is always used
  const secureApiUrl = API_BASE_URL.replace(/^http:/, 'https:');

  const handleDownload = async (imageId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(imageId)
    const endpoint = `/downloads/${imageId}`
    const url = `${secureApiUrl}${endpoint}`;

    try {
      // In a real implementation, this would call the API
      const response = await fetch(url, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Download failed');

      const data = await response.json();

      // Create a download link
      const link = document.createElement('a');
      link.href = data.download_url;
      link.setAttribute('download', `image-${imageId}.jpg`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  // Download icon SVG component
  const DownloadIcon = () => (
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

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-light uppercase tracking-wider">
                THIRTEENK
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center rounded-full bg-gray-100 px-4 py-2">
                <span className="mr-2 text-sm">{t('totalDownloads')}</span>
                <span className="font-bold">
                  {isLoading ? '...' : totalDownloads.toLocaleString()}
                </span>
              </div>

              <div>
                <Link href="/" locale="en" className="mx-1 text-sm hover:text-blue-600">
                  EN
                </Link>
                <span className="mx-1 text-gray-300">|</span>
                <Link href="/" locale="zu" className="mx-1 text-sm hover:text-blue-600">
                  ZU
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto py-12 px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="aspect-square w-full overflow-hidden rounded-lg">
                  <LoadingSkeleton />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="overflow-hidden rounded-lg bg-white transition-shadow hover:shadow-md"
                  onMouseEnter={() => handleMouseEnter(image.id)}
                  onMouseLeave={() => handleMouseLeave(image.id)}
                >
                  <div className="relative aspect-square w-full">
                    <Image
                      src={image.thumbnail_url}
                      alt={image.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                      priority={images.indexOf(image) < 4}
                    />

                    {/* Desktop hover overlay with full button */}
                    {isHoveredMap[image.id] && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 hidden md:flex items-end p-4 transition-opacity">
                        <button
                          onClick={(e) => handleDownload(image.id, e)}
                          className="w-full py-2 cursor-pointer px-4 bg-white text-gray-900 text-sm font-medium rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                          {t('download')}
                        </button>
                      </div>
                    )}

                    {/* Mobile download button - always visible */}
                    <button
                      onClick={(e) => handleDownload(image.id, e)}
                      className="md:hidden absolute bottom-3 right-3 cursor-pointer rounded-md p-2 bg-white text-gray-900 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                      aria-label={t('download')}
                    >
                      <DownloadIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-100">
        <div className="container mx-auto px-4">
          T H I R T E E N K
        </div>
      </footer>
    </div>
  );
}