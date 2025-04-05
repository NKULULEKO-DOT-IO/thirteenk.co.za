import { useState } from 'react';
import { downloadImage as apiDownloadImage, getTotalDownloads, getImageDownloads } from '@/lib/api';

interface UseDownloadResult {
  downloadImage: (imageId: string) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

export function useDownload(): UseDownloadResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleDownload = async (imageId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiDownloadImage(imageId);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = response.download_url;

      // Extract filename from URL or use a default name
      const fileName = response.download_url.split('/').pop() || `image-${imageId}.jpg`;
      link.setAttribute('download', fileName);

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to download image');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    downloadImage: handleDownload,
    isLoading,
    error,
  };
}

interface UseDownloadStatsResult {
  totalDownloads: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDownloadStats(): UseDownloadStatsResult {
  const [totalDownloads, setTotalDownloads] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTotalDownloads();
      setTotalDownloads(response.total_downloads);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch download stats'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    totalDownloads,
    isLoading,
    error,
    refetch: fetchStats,
  };
}