import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/lib/api';
import {
  UseDownloadResult,
  UseDownloadStatsOptions,
  UseDownloadStatsResult,
  EnhancedDownloadData,
  DownloadAnalytics,
  DeviceInfo,
  GeoLocation,
  SessionInfo
} from '@/types/hooks/use-download.types';
import { getUserFriendlyErrorMessage } from '@/utils/errorUtils';
import { config } from '@/app/config';

/**
 * Hook for fetching and managing download statistics
 * Now with analytics support
 */
export function useDownloadStats(
  options: UseDownloadStatsOptions = {}
): UseDownloadStatsResult {
  const {
    fetchOnMount = true,
    pollingInterval = 0,
    includeAnalytics = false
  } = options;

  const [totalDownloads, setTotalDownloads] = useState<number>(0);
  const [analytics, setAnalytics] = useState<DownloadAnalytics | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Use ref to track interval ID for proper cleanup
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  // Use ref to track if component is mounted
  const isMountedRef = useRef<boolean>(true);
  // Track last successful fetch time to avoid flooding
  const lastFetchTimeRef = useRef<number>(0);
  // Minimum time between fetches (ms)
  const MIN_FETCH_INTERVAL = 5000;

  // For debugging in development
  const isDev = config.isDevelopment;

  const fetchStats = useCallback(async (): Promise<void> => {
    // Prevent fetching if unmounted
    if (!isMountedRef.current) return;

    // Add rate limiting to prevent floods
    const now = Date.now();
    if (now - lastFetchTimeRef.current < MIN_FETCH_INTERVAL) {
      if (isDev) console.log('Throttling download stats fetch - too soon');
      return;
    }

    // Don't set loading to true on polling updates to avoid UI flickers
    if (isLoading || retryCount === 0) {
      setIsLoading(true);
    }
    setError(null);

    try {
      if (isDev) {
        console.log('Fetching download statistics...');
        console.log(`API Base URL: ${config.apiBaseUrl}`);
      }

      lastFetchTimeRef.current = now;

      const response = await api.getTotalDownloads();

      if (isDev) {
        console.log('Download stats response:', response);
      }

      // Skip state updates if component unmounted during request
      if (!isMountedRef.current) return;

      if (response && typeof response.total_downloads === 'number') {
        setTotalDownloads(response.total_downloads);
        setRetryCount(0); // Reset retry count on success
      } else {
        console.warn('Received invalid download stats format:', response);
        // Set to 0 when format is invalid to maintain UI integrity
        setTotalDownloads(0);
      }

      // If analytics are requested, fetch them
      if (includeAnalytics) {
        try {
          // Call analytics endpoint
          const analyticsData: DownloadAnalytics = await api.get('/downloads/analytics', {
            params: { days: 30 }
          });

          if (!isMountedRef.current) return;

          if (analyticsData) {
            setAnalytics(analyticsData);
            if (isDev) {
              console.log('Analytics data received:', analyticsData);
            }
          }
        } catch (analyticsError) {
          console.error('Failed to fetch download analytics:', analyticsError);
          // Don't fail the whole request if just analytics fail
        }
      }
    } catch (err) {
      // Skip state updates if component unmounted during request
      if (!isMountedRef.current) return;

      console.error('Error fetching download stats:', err);
      setError(new Error(getUserFriendlyErrorMessage(err)));

      // Auto-retry on errors (up to 3 times) with exponential backoff
      if (retryCount < 3) {
        const delayMs = 1000 * Math.pow(2, retryCount); // Exponential backoff
        console.log(`Retrying stats fetch in ${delayMs/1000}s (attempt ${retryCount + 1}/3)...`);

        setTimeout(() => {
          if (isMountedRef.current) {
            setRetryCount(prev => prev + 1);
          }
        }, delayMs);
      }
    } finally {
      // Skip state updates if component unmounted during request
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [isLoading, retryCount, isDev, includeAnalytics]);

  // Handle download events
  const handleImageDownloaded = useCallback((event: Event) => {
    // Optimistically update the download count
    setTotalDownloads(prevCount => prevCount + 1);

    // Handle custom event details if available
    const customEvent = event as CustomEvent;
    if (customEvent.detail && isDev) {
      console.log('Download event details:', customEvent.detail);
    }

    // After a reasonable delay, fetch the actual count to ensure accuracy
    setTimeout(() => {
      if (isMountedRef.current) {
        fetchStats();
      }
    }, 5000); // Wait 5 seconds before verifying the count
  }, [fetchStats, isDev]);

  useEffect(() => {
    // Mark as mounted
    isMountedRef.current = true;

    // Listen for download events
    window.addEventListener('image-downloaded', handleImageDownloaded);

    if (fetchOnMount) {
      fetchStats();
    }

    // Set up polling if interval is specified and greater than minimum
    if (pollingInterval > 0 && pollingInterval >= MIN_FETCH_INTERVAL) {
      if (isDev) console.log(`Setting up polling interval: ${pollingInterval}ms`);

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Set new interval
      intervalRef.current = setInterval(fetchStats, pollingInterval);
    }

    // Cleanup function
    return () => {
      // Mark as unmounted
      isMountedRef.current = false;

      // Remove event listener
      window.removeEventListener('image-downloaded', handleImageDownloaded);

      // Clear polling interval
      if (intervalRef.current) {
        if (isDev) console.log('Clearing download stats polling interval');
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchStats, fetchOnMount, pollingInterval, handleImageDownloaded, isDev]);

  // Manual refetch function that resets retry count
  const refetch = useCallback(async (): Promise<void> => {
    setRetryCount(0);
    await fetchStats();
  }, [fetchStats]);

  return {
    totalDownloads,
    isLoading,
    error,
    refetch,
    analytics
  };
}
/**
 * Enhanced hook for handling image downloads with rich tracking data
 *
 * @returns Object containing download function, loading state, and error information
 */
export function useDownload(): UseDownloadResult {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastDownload, setLastDownload] = useState<EnhancedDownloadData | undefined>(undefined);
  const isDev = config.isDevelopment;

  // Collect basic device info for tracking
  const collectDeviceInfo = useCallback((): DeviceInfo => {
    const deviceInfo: DeviceInfo = {
      type: "unknown"
    };

    try {
      const userAgent = navigator.userAgent;

      // Simple device type detection
      if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
        deviceInfo.type = /iPad/i.test(userAgent) ? "tablet" : "mobile";
      } else {
        deviceInfo.type = "desktop";
      }

      // Browser detection
      if (userAgent.indexOf("Chrome") !== -1) {
        deviceInfo.browser = "Chrome";
      } else if (userAgent.indexOf("Safari") !== -1) {
        deviceInfo.browser = "Safari";
      } else if (userAgent.indexOf("Firefox") !== -1) {
        deviceInfo.browser = "Firefox";
      } else if (userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident") !== -1) {
        deviceInfo.browser = "Internet Explorer";
      } else if (userAgent.indexOf("Edge") !== -1) {
        deviceInfo.browser = "Edge";
      }

      // OS detection
      if (userAgent.indexOf("Windows") !== -1) {
        deviceInfo.os = "Windows";
      } else if (userAgent.indexOf("Mac") !== -1) {
        deviceInfo.os = "MacOS";
      } else if (userAgent.indexOf("Linux") !== -1) {
        deviceInfo.os = "Linux";
      } else if (userAgent.indexOf("Android") !== -1) {
        deviceInfo.os = "Android";
      } else if (userAgent.indexOf("iOS") !== -1 || /iPhone|iPad|iPod/i.test(userAgent)) {
        deviceInfo.os = "iOS";
      }

      // Screen info
      deviceInfo.screen_resolution = `${window.screen.width}x${window.screen.height}`;
      deviceInfo.viewport_size = `${window.innerWidth}x${window.innerHeight}`;
      deviceInfo.pixel_ratio = window.devicePixelRatio;

    } catch (e) {
      console.error("Error collecting device info:", e);
    }

    return deviceInfo;
  }, []);

  const handleDownload = useCallback(async (
    imageId: string,
    trackingData: Record<string, any> = {}
  ): Promise<void> => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    const downloadStartTime = Date.now();

    try {
      if (isDev) {
        console.log(`Initiating download for image: ${imageId}`);
        console.log(`API Base URL: ${config.apiBaseUrl}`);
      }

      // Collect device info for tracking
      const deviceInfo = collectDeviceInfo();

      // Create session info for tracking
      const sessionInfo: SessionInfo = {
        referrer_url: document.referrer,
        landing_page: window.location.href,
        user_agent: navigator.userAgent
      };

      // If you implement a session tracking system, you could add the session ID here
      if (typeof window !== 'undefined' && window.localStorage) {
        const sessionId = localStorage.getItem('session_id') ||
          `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        if (!localStorage.getItem('session_id')) {
          localStorage.setItem('session_id', sessionId);
        }

        sessionInfo.session_id = sessionId;
      }

      // Prepare enhanced download data
      const downloadData: EnhancedDownloadData = {
        image_id: imageId,
        device: deviceInfo,
        session: sessionInfo,
        download_successful: false,
        timestamp: new Date().toISOString(),
        custom_tracking: trackingData
      };

      // Do the actual download
      const response = await api.downloadImage(imageId);

      // Add better error logging and defensive checks
      if (isDev) {
        console.log('Download response:', response);
      }

      // Handle both possible response formats to be safe
      let downloadUrl: string | undefined;

      if (typeof response === 'object' && response !== null) {
        downloadUrl = response.download_url;
      } else {
        console.error('Unexpected response format:', response);
        throw new Error('Invalid download response from server');
      }

      if (!downloadUrl) {
        console.error('Download URL is missing from response:', response);
        throw new Error('Download URL is missing from server response');
      }

      // Ensure the download URL uses HTTPS
      let secureDownloadUrl = downloadUrl;
      if (secureDownloadUrl.startsWith('http:')) {
        secureDownloadUrl = secureDownloadUrl.replace(/^http:/i, 'https:');
      }

      if (isDev) console.log(`Download URL received: ${secureDownloadUrl}`);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = secureDownloadUrl;

      // Extract filename from URL or use a default name
      const fileName = secureDownloadUrl.split('/').pop() || `image-${imageId}.jpg`;
      link.setAttribute('download', fileName);

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update download data with success
      downloadData.download_successful = true;
      downloadData.download_time_ms = Date.now() - downloadStartTime;

      // Store the last download
      setLastDownload(downloadData);

      if (isDev) console.log(`Download successfully initiated for ${fileName}`);

      // Signal to the application that a download has occurred
      // This allows components to update their download counts without polling
      window.dispatchEvent(new CustomEvent('image-downloaded', {
        detail: {
          imageId,
          timestamp: Date.now(),
          deviceInfo,
          sessionInfo,
          trackingData
        }
      }));

      // If you have an API endpoint to record enhanced download data
      // you would call it here
      try {
        // This is a placeholder for what would be an actual implementation
        // await api.post('/downloads/track', downloadData);
        if (isDev) console.log('Download tracking data:', downloadData);
      } catch (trackingError) {
        console.error('Failed to send download tracking data:', trackingError);
        // Don't fail the whole download if just tracking fails
      }

    } catch (err) {
      console.error('Download failed:', err);
      setError(new Error(getUserFriendlyErrorMessage(err)));
      throw err;
    } finally {
      // Small delay to ensure the UI shows loading state for better UX
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [isLoading, isDev, collectDeviceInfo]);
  return {
    downloadImage: handleDownload,
    isLoading,
    error,
    lastDownload
  };
}