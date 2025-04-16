export type SkeletonAnimation = 'pulse' | 'none';

export interface SkeletonDimensions {
  /**
   * Width in Tailwind CSS classes
   * e.g., 'w-full', 'w-64', etc.
   */
  width?: string;

  /**
   * Height in Tailwind CSS classes
   * e.g., 'h-full', 'h-64', etc.
   */
  height?: string;
}

export interface LoadingSkeletonProps extends SkeletonDimensions {
  /**
   * Optional custom CSS class for the skeleton
   */
  className?: string;

  /**
   * Optional animation type (defaults to 'pulse')
   * Note: 'wave' animation requires custom CSS not included by default
   */
  animation?: SkeletonAnimation;

  /**
   * Optional border radius in Tailwind CSS classes
   * e.g., 'rounded', 'rounded-lg', etc.
   */
  borderRadius?: string;

  /**
   * Optional boolean to show text content for screen readers
   * Defaults to true
   */
  showAccessibleText?: boolean;

  /**
   * Optional text content for screen readers
   * Defaults to "Loading..."
   */
  accessibleText?: string;
}