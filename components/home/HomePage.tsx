'use client';

import { FC, useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Layout from '@/components/layout/Layout';
import GalleryGrid from '@/components/gallery/GalleryGrid';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { ImageData } from '@/types/gallery/image.types';
import { getImages, getTotalDownloads } from "@/lib/api";

const IMAGES_PER_PAGE = 30

const HomePage: FC = () => {
  const t = useTranslations('HomePage');

  // State for images and loading
  const [allImages, setAllImages] = useState<ImageData[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [skip, setSkip] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // State for download stats
  const [totalDownloads, setTotalDownloads] = useState<number>(0);
  const [statsLoading, setStatsLoading] = useState<boolean>(true);

  // Fetch initial images and set up data
  useEffect(() => {
    const fetchInitialImages = async () => {
      try {
        setInitialLoading(true);
        setError(null);

        const response = await getImages(0, 30);

        if (response && Array.isArray(response.images)) {
          setAllImages(response.images);
          setHasMore((response.total || 0) > response.images.length);
        } else {
          setAllImages([]);
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error fetching images:', err);
        setError(err instanceof Error ? err : new Error('Failed to load images'));
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialImages();
  }, []);

  // Fetch more images when skip changes
  useEffect(() => {
    const fetchMoreImages = async () => {
      // Skip the initial load, that's handled by fetchInitialImages
      if (skip === 0) return;

      try {
        setError(null);

        const response = await getImages(skip, IMAGES_PER_PAGE);

        if (response && Array.isArray(response.images)) {
          // Append new images, filter out any duplicates by ID
          setAllImages(prevImages => {
            const existingIds = new Set(prevImages.map(img => img.id));
            const newImages = response.images.filter(img => !existingIds.has(img.id));
            return [...prevImages, ...newImages];
          });
          setHasMore((response.total || 0) > skip + response.images.length);
        }
      } catch (err) {
        console.error('Error fetching more images:', err);
        setError(err instanceof Error ? err : new Error('Failed to load more images'));
      } finally {
        setIsLoadingMore(false);
      }
    };

    if (skip > 0) {
      fetchMoreImages();
    }
  }, [skip]);

  // Fetch download stats
  useEffect(() => {
    const fetchDownloadStats = async () => {
      try {
        setStatsLoading(true);
        const response = await getTotalDownloads();

        if (response && typeof response.total_downloads === 'number') {
          setTotalDownloads(response.total_downloads);
        }
      } catch (error) {
        console.error('Error fetching download stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchDownloadStats();

    // Set up polling interval (60 seconds)
    const intervalId = setInterval(fetchDownloadStats, 60000);

    // Listen for download events to update count
    const handleImageDownloaded = () => {
      // Optimistically update the download count
      setTotalDownloads(prevCount => prevCount + 1);

      // After a delay, fetch the actual count to ensure accuracy
      setTimeout(fetchDownloadStats, 5000);
    };

    window.addEventListener('image-downloaded', handleImageDownloaded);

    // Clean up on unmount
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('image-downloaded', handleImageDownloaded);
    };
  }, []);

  // Load more images function for infinite scroll
  const loadMore = useCallback(() => {
    if (isLoadingMore || initialLoading || !hasMore) return;

    setIsLoadingMore(true);

    // Update skip to fetch the next batch
    const nextSkip = skip + IMAGES_PER_PAGE;
    setSkip(nextSkip);
  }, [isLoadingMore, initialLoading, hasMore, skip]);

  // Refresh/retry function
  const handleRefresh = useCallback(() => {
    setSkip(0);
    setAllImages([]);
    setInitialLoading(true);
    setHasMore(true);
    setError(null);
  }, []);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (!hasMore || isLoadingMore || initialLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // If the sentinel is visible and we're not already loading more
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !initialLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the sentinel is visible
    );

    // Find the sentinel element
    const sentinel = document.getElementById('infinite-scroll-sentinel');
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore, initialLoading, loadMore]);

  return (
    <Layout
      totalDownloads={totalDownloads}
      isLoading={statsLoading}
      footerProps={{
        showBusinessPlanLink: true
      }}
    >
      <div className="container mx-auto py-12 px-4">
        {/* Error message with retry button */}
        {error && (
          <div className="text-red-500 mb-8 p-6 bg-red-50 rounded-lg text-center">
            <p className="text-lg font-medium mb-4">{t('errorLoading')}</p>
            <p className="mb-4">{error.message}</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
            >
              {t('retryLoading')}
            </button>
          </div>
        )}

        {/* Initial loading state */}
        {initialLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: IMAGES_PER_PAGE }).map((_, index) => (
              <div key={index} className="aspect-square w-full overflow-hidden rounded-lg">
                <LoadingSkeleton />
              </div>
            ))}
          </div>
        )}

        {/* No images message */}
        {!initialLoading && !error && allImages.length === 0 && (
          <div className="text-center py-16">
            <p>{t('noImages')}</p>
          </div>
        )}

        {/* Images display */}
        {!initialLoading && allImages.length > 0 && (
          <div>
            <GalleryGrid
              images={allImages}
              columns={{ default: 1, sm: 2, md: 3, lg: 4 }}
            />

            {/* Loading more indicator */}
            {isLoadingMore && (
              <div className="mt-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              </div>
            )}

            {/* Sentinel element for infinite scroll */}
            <div
              id="infinite-scroll-sentinel"
              className="h-4 w-full"
              style={{ visibility: hasMore ? 'visible' : 'hidden' }}
            />
          </div>
        )}

        {/* No more images message */}
        {!hasMore && allImages.length > 0 && (
          <div className="text-center text-gray-500 mt-8 py-4">
            {t('noMoreImages')}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HomePage;