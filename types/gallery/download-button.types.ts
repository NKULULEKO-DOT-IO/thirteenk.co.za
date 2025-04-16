export type DownloadButtonVariant = 'default' | 'icon' | 'text' | 'primary' | 'secondary';

export interface DownloadButtonState {
  /**
   * Whether the button is in loading state
   * If provided, the component will be controlled externally
   */
  isLoading?: boolean;

  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
}

export interface DownloadCallbacks {
  /**
   * Optional callback function triggered when download starts
   * @returns void
   */
  onDownloadStart?: () => void;

  /**
   * Optional callback function triggered after successful download
   * @returns void
   */
  onDownloadComplete?: () => void;

  /**
   * Optional callback function triggered if download fails
   * @param error The error that occurred
   * @returns void
   */
  onDownloadError?: (error: Error) => void;
}

export interface DownloadButtonProps extends DownloadButtonState, DownloadCallbacks {
  /**
   * ID of the image to download (required)
   */
  imageId: string;

  /**
   * Optional custom CSS class for the button container
   */
  className?: string;

  /**
   * Optional custom CSS class for the button icon
   */
  iconClassName?: string;

  /**
   * Optional custom CSS class for the button text
   */
  textClassName?: string;

  /**
   * Optional button label text
   * If not provided, will use translation key "download"
   */
  label?: string;

  /**
   * Optional text to display while downloading
   * If not provided, will use translation key "processing"
   */
  loadingText?: string;

  /**
   * Optional button variant
   * - default: Standard button with icon and text
   * - icon: Icon-only button (often used on mobile)
   * - text: Text-only button with no background
   * - primary: Prominent colored button
   * - secondary: Less prominent alternative button
   */
  variant?: DownloadButtonVariant;

  /**
   * Optional download URL override
   * If provided, will use this URL instead of constructing one from imageId
   */
  downloadUrl?: string;

  /**
   * Optional flag to track download analytics
   * Defaults to true
   */
  trackAnalytics?: boolean;

  /**
   * Optional attributes to pass to the underlying button element
   */
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}