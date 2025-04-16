import { ImageData } from './image.types';

export interface GalleryGridProps {
  /**
   * Array of images to display in the grid
   */
  images: ImageData[];

  /**
   * Optional custom CSS class for the grid container
   */
  className?: string;

  /**
   * Optional callback when an image is clicked
   */
  onImageClick?: (image: ImageData) => void;

  /**
   * Optional custom column configuration
   * Default is responsive: 1 column on mobile, 2 on small screens, 3 on medium, 4 on large
   */
  columns?: {
    default: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}