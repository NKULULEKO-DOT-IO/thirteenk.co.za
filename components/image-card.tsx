import Image from 'next/image';
import { FC, useState } from 'react';
import DownloadButton from './download-button';

// Define the image interface based on the backend schema
interface ImageData {
  id: string;
  name: string;
  thumbnail_url: string;
  downloads: number;
}

interface ImageCardProps {
  image: ImageData;
  priority?: boolean;
}

const ImageCard: FC<ImageCardProps> = ({
                                         image,
                                         priority = false
                                       }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="overflow-hidden rounded-lg bg-white transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square w-full">
        <Image
          src={image.thumbnail_url}
          alt={image.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
          priority={priority}
        />

        {isHovered && (
          <div className="absolute inset-0 flex items-end p-4">
            <div className="w-full">
              <DownloadButton imageId={image.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCard;