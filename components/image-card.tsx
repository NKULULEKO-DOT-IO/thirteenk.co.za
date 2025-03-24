import Image from 'next/image'
import { FC } from 'react'

// Define the prop types interface
interface ImageCardProps {
  fileName: string;
  alt?: string; // Optional prop with default value
  width?: number; // Optional
  height?: number; // Optional
  priority?: boolean; // Optional
}

const ImageCard: FC<ImageCardProps> = ({
                                         fileName,
                                         alt = "Example image", // Default value
                                         width = 500, // Default value
                                         height = 300, // Default value
                                         priority = false // Default value
                                       }) => {
  return (
    <div>
      <Image
        src={fileName} // Path relative to the public directory
        alt={alt}
        width={width}
        height={height}
        priority={priority}
      />
    </div>
  )
};

export default ImageCard