import { ImageData } from '../gallery/image.types';

export interface UseImagesOptions {
  /**
   * Number of images to skip (for pagination)
   */
  skip?: number;

  /**
   * Maximum number of images to return
   */
  limit?: number;

  /**
   * Optional tags to filter images by
   */
  tags?: string[];

  /**
   * Whether to only return featured images
   */
  featured?: boolean;
}

export interface UseImagesResult {
  /**
   * Array of image data
   */
  images: ImageData[];

  /**
   * Total number of images matching the query (for pagination)
   */
  total: number;

  /**
   * Whether images are currently loading
   */
  isLoading: boolean;

  /**
   * Error if the fetch failed
   */
  error: Error | null;

  /**
   * Function to manually refetch images
   */
  refetch?: () => Promise<void>;
}