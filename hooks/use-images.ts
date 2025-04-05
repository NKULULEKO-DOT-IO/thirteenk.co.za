import { useState, useEffect } from 'react';
import { getImages, getImageById, ImageData, ImagesResponse } from '@/lib/api';

interface UseImagesOptions {
  skip?: number;
  limit?: number;
  tags?: string[];
  featured?: boolean;
}

interface UseImagesResult {
  images: ImageData[];
  totalImages: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useImages(options: UseImagesOptions = {}): UseImagesResult {
  const { skip = 0, limit = 20, tags, featured } = options;
  const [data, setData] = useState<ImagesResponse>({ images: [], total: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getImages(skip, limit, tags, featured);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch images'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [skip, limit, tags?.join(','), featured]);

  return {
    images: data.images,
    totalImages: data.total,
    isLoading,
    error,
    refetch: fetchImages,
  };
}

interface UseImageResult {
  image: ImageData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useImage(id: string): UseImageResult {
  const [image, setImage] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchImage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getImageById(id);
      setImage(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch image'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchImage();
    }
  }, [id]);

  return {
    image,
    isLoading,
    error,
    refetch: fetchImage,
  };
}