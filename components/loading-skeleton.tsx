import { FC } from 'react';

interface LoadingSkeletonProps {
  className?: string;
}

const LoadingSkeleton: FC<LoadingSkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 h-full w-full dark:bg-gray-700 ${className}`}
      aria-hidden="true"
    >
      <div className="sr-only">Loading...</div>
    </div>
  );
};

export default LoadingSkeleton;