import { FC, useEffect, useState } from 'react';
import { getTotalDownloads } from '@/lib/api';

interface DownloadCounterProps {
  className?: string;
}

const DownloadCounter: FC<DownloadCounterProps> = ({ className = '' }) => {
  const [totalDownloads, setTotalDownloads] = useState<number>(13000); // Default starting value
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch the initial download count on component mount
  useEffect(() => {
    const fetchInitialCount = async () => {
      try {
        setIsLoading(true);
        const response = await getTotalDownloads();
        setTotalDownloads(response.total_downloads);
      } catch (error) {
        console.error('Failed to fetch download count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialCount();
  }, []);

  return (
    <div className={`flex items-center rounded-full bg-gray-100 px-4 py-2 ${className}`}>
      <span className="mr-2 text-sm font-medium">Total Downloads</span>
      <span className="text-xl font-bold">
        {isLoading ? '...' : totalDownloads.toLocaleString()}
      </span>
    </div>
  );
};

export default DownloadCounter;