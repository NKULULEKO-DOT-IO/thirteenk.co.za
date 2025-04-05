import { FC } from 'react';
import ImageCard from './image-card';

interface ImageData {
  id: string;
  name: string;
  thumbnail_url: string;
  downloads: number;
}

interface GalleryGridProps {
  images: ImageData[];
}

const GalleryGrid: FC<GalleryGridProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((image, index) => (
        <ImageCard
          key={image.id}
          image={image}
          priority={index < 4}
        />
      ))}
    </div>
  );
};

export default GalleryGrid;