// Base type for image metadata
export interface ImageMetadata {
  /**
   * Image width in pixels
   */
  width?: number;

  /**
   * Image height in pixels
   */
  height?: number;

  /**
   * Camera make (manufacturer)
   */
  camera_make?: string;

  /**
   * Camera model
   */
  camera_model?: string;

  /**
   * Lens information
   */
  lens_info?: string;

  /**
   * Focal length in mm
   */
  focal_length?: number;

  /**
   * Aperture (f-stop)
   */
  aperture?: number;

  /**
   * ISO speed
   */
  iso?: number;

  /**
   * Exposure time (shutter speed)
   */
  exposure_time?: string;

  /**
   * Geographic location where photo was taken
   */
  location?: {
    latitude: number;
    longitude: number;
  };

  /**
   * Date and time when photo was taken
   */
  taken_at?: string;

  /**
   * Color profile information
   */
  color_profile?: string;

  /**
   * Array of dominant colors in the image (hex values)
   */
  dominant_colors: string[];

  /**
   * Software used to create/edit the image
   */
  software?: string;
}

// Enhanced image data type
export interface ImageData {
  /**
   * Unique identifier for the image
   */
  id: string;

  /**
   * Display name of the image
   */
  name: string;

  /**
   * Optional description of the image
   */
  description?: string;

  /**
   * Original filename
   */
  filename: string;

  /**
   * URL to the thumbnail version of the image
   */
  thumbnail_url: string;

  /**
   * URL to the high-definition version of the image
   */
  hd_url: string;

  /**
   * Number of times the image has been downloaded
   */
  downloads: number;

  /**
   * File size in bytes
   */
  file_size: number;

  /**
   * MIME type of the image
   */
  content_type: string;

  /**
   * Tags associated with the image
   */
  tags: string[];

  /**
   * Whether the image is featured
   */
  is_featured: boolean;

  /**
   * Creation timestamp
   */
  created_at: string;

  /**
   * Last update timestamp
   */
  updated_at?: string;

  /**
   * Enhanced metadata extracted from the image
   */
  metadata?: ImageMetadata;

  /**
   * Author or photographer name
   */
  author?: string;

  /**
   * Copyright information
   */
  copyright?: string;

  /**
   * License type (e.g., CC-BY, CC0, etc.)
   */
  license_type?: string;

  /**
   * Higher-level categories for organization
   */
  categories?: string[];

  /**
   * Accessibility description for the image
   */
  alt_text?: string;

  /**
   * Any additional custom metadata
   */
  custom_metadata?: Record<string, any>;
}

export interface ImageCardProps {
  /**
   * Image data to display
   */
  image: ImageData;

  /**
   * Whether to prioritize loading this image (for above-fold content)
   */
  priority?: boolean;

  /**
   * Text to display on the download button
   */
  downloadLabel: string;

  /**
   * Optional custom CSS class for the card
   */
  className?: string;

  /**
   * Optional callback when image is clicked
   */
  onClick?: (image: ImageData) => void;

  /**
   * Whether to show enhanced metadata
   */
  showMetadata?: boolean;
}