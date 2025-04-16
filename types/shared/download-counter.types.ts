export interface DownloadCounterProps {
  /**
   * Total number of downloads to display
   */
  totalDownloads: number;

  /**
   * Whether the download count is currently loading
   */
  isLoading: boolean;

  /**
   * Optional custom CSS class
   */
  className?: string;

  /**
   * Optional label to display before the counter (defaults to "Total Downloads")
   */
  label?: string;

  /**
   * Optional variant of the counter (default or compact)
   */
  variant?: 'default' | 'compact';
}