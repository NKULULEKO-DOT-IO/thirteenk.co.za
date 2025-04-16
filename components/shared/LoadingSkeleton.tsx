import { FC } from 'react';
import { LoadingSkeletonProps } from '@/types/shared/loading-skeleton.types';

/**
 * LoadingSkeleton component for showing loading states in the UI
 *
 * @example
 * // Basic usage
 * <LoadingSkeleton />
 *
 * @example
 * // Custom dimensions
 * <LoadingSkeleton width="w-64" height="h-32" />
 *
 * @example
 * // Without animation
 * <LoadingSkeleton animation="none" />
 */
const LoadingSkeleton: FC<LoadingSkeletonProps> = ({
                                                     className = '',
                                                     height = 'h-full',
                                                     width = 'w-full',
                                                     animation = 'pulse',
                                                     borderRadius = 'rounded-lg',
                                                     showAccessibleText = true,
                                                     accessibleText = 'Loading...'
                                                   }) => {
  // Build animation class based on prop
  const animationClass = animation === 'pulse' ? 'animate-pulse' : '';

  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 ${height} ${width} ${borderRadius} ${animationClass} ${className}`}
      aria-hidden={!showAccessibleText}
    >
      {showAccessibleText && (
        <div className="sr-only">{accessibleText}</div>
      )}
    </div>
  );
};

export default LoadingSkeleton;