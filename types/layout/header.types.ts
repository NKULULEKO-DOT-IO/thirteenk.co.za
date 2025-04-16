export interface HeaderProps {
  /**
   * Total number of downloads to display in the counter
   */
  totalDownloads: number;

  /**
   * Whether the download count is currently loading
   */
  isLoading: boolean;

  /**
   * Optional custom CSS class for the header
   */
  className?: string;

  /**
   * Optional title text (defaults to "THIRTEENK")
   */
  title?: string;

  /**
   * Optional array of locales to display in language switcher
   */
  locales?: Array<{
    code: string;
    label: string;
  }>;
}