import { FC, useState, useRef, useEffect, useCallback } from 'react';
import ImageCard from './ImageCard';
import ImageViewerModal from './ImageViewerModal';
import LoadingSkeleton from '@/components/shared/LoadingSkeleton';
import { useTranslations } from 'next-intl';
import { GalleryGridProps } from '@/types/gallery/gallery-grid.types';
import { ImageData } from '@/types/gallery/image.types';

interface ExtendedGalleryGridProps extends GalleryGridProps {
  /**
   * Function to load more images when scrolling
   */
  onLoadMore?: () => void;

  /**
   * Whether more images are being loaded
   */
  isLoadingMore?: boolean;

  /**
   * Whether there are more images to load
   */
  hasMore?: boolean;
}

const GalleryGrid: FC<ExtendedGalleryGridProps> = ({
                                                     images,
                                                     className = '',
                                                     onImageClick,
                                                     onLoadMore,
                                                     isLoadingMore = false,
                                                     hasMore = false,
                                                     columns = { default: 1, sm: 2, md: 3, lg: 4 }
                                                   }) => {
  const t = useTranslations('HomePage');
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  // Build responsive grid classes based on column configuration
  const gridClasses = [
    `grid-cols-${columns.default}`,
    columns.sm ? `sm:grid-cols-${columns.sm}` : '',
    columns.md ? `md:grid-cols-${columns.md}` : '',
    columns.lg ? `lg:grid-cols-${columns.lg}` : '',
  ].filter(Boolean).join(' ');

  // Handle image click to show in modal
  const handleImageClick = (image: ImageData) => {
    setSelectedImage(image);

    // Also call the provided onClick handler if it exists
    if (onImageClick) {
      onImageClick(image);
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Infinite scroll implementation
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoadingMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && onLoadMore) {
        onLoadMore();
      }
    }, { rootMargin: '200px' });

    if (node) observer.current.observe(node);
  }, [isLoadingMore, hasMore, onLoadMore]);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return (
    <>
      <div className={`grid gap-6 ${gridClasses} ${className}`}>
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image}
            priority={index < 4}
            downloadLabel={t('download')}
            onClick={handleImageClick}
          />
        ))}

        {/* Load more sentinel element */}
        {hasMore && (
          <div
            ref={lastElementRef}
            className="col-span-full h-4"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Loading indicator for more images */}
      {isLoadingMore && (
        <div className="mt-8 grid gap-6 w-full">
          <div className={`grid gap-6 ${gridClasses}`}>
            {Array.from({ length: columns.lg || 4 }).map((_, index) => (
              <div key={`loading-more-${index}`} className="aspect-square w-full overflow-hidden rounded-lg">
                <LoadingSkeleton />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image viewer modal */}
      <ImageViewerModal
        image={selectedImage}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default GalleryGrid;