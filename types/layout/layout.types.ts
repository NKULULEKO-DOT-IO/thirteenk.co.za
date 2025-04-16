import { ReactNode } from 'react';

export interface LayoutProps {
  /**
   * Content to render within the layout
   */
  children: ReactNode;

  /**
   * Total number of downloads to pass to the header component
   */
  totalDownloads: number;

  /**
   * Whether the download count is currently loading
   */
  isLoading: boolean;

  /**
   * Optional custom CSS class for the layout container
   */
  className?: string;

  /**
   * Optional custom page title
   */
  pageTitle?: string;

  /**
   * Optional footer configuration
   */
  footerProps?: {
    showBusinessPlanLink?: boolean;
    copyrightText?: string;
  };
}