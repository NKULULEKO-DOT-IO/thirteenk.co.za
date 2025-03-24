# Thirteenk Frontend

Phase One Goal (1st of April 2025) ~ Fully Functional Image Download Platform With 8 Images. 

![Canvas](https://github.com/user-attachments/assets/641de545-cafa-46d7-a19c-b9c67960ff8d)


## Overview

This repository contains the frontend application for Thirteenk, a cultural digital content platform focusing on South African imagery. The application is built using Next.js 14 with the App Router architecture, React 18, and Tailwind CSS.

## Technology Stack

- **Next.js 15+**: React framework with App Router architecture
- **React 18+**: Component-based UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **next-i18next**: Internationalization support *** (For Next Phases)

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

## Project Structure

```
thirteenk.co.za/
├── app/                             # App Router directory
│   ├── [locale]/                    # Internationalization routes
│   │   ├── page.tsx                 # Home page with gallery
│   │   ├── layout.tsx               # Root layout with header/footer
│   │   ├── images/                  # Images routes
│   │   │   ├── [id]/                # Dynamic route for image details
│   │   │   │   └── page.tsx         # Image detail page
│   │   │   └── page.tsx             # All images page
│   │   └── not-found.tsx            # 404 page
│   ├── api/                         # Client-side API handlers
│   │   └── revalidate/              # Revalidation endpoints
│   │       └── route.ts             # Route handler
│   └── globals.css                  # Global styles
├── components/                      # Shared components
│   ├── ui/                          # UI components
│   │   ├── button.tsx               # Button component
│   │   ├── counter.tsx              # Download counter component
│   │   └── gallery-grid.tsx         # Image gallery grid
│   ├── image-card.tsx               # Image card component
│   ├── image-detail.tsx             # Image detail component
│   ├── download-button.tsx          # Download button component
│   └── loading-skeleton.tsx         # Loading skeleton component
├── lib/                             # Utility functions and hooks
│   ├── api.ts                       # API client
│   └── utils.ts                     # Utility functions
├── hooks/                       # Custom hooks
│   ├── use-images.ts            # Hook for fetching images
│   └── use-download.ts          # Hook for handling downloads
├── public/                          # Static assets
│   └── locales/                     # i18n translation files
├── middleware.ts                    # Next.js middleware for i18n routing
├── next.config.js                   # Next.js configuration
└── tailwind.config.js               # Tailwind CSS configuration
```

## Installation and Setup

### Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/thirteenk/frontend.git
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_STORAGE_URL=https://storage.googleapis.com/thirteenk-images
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

### Production Build

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Key Components

### Gallery Component

The Gallery component displays a grid of images from the API:

```tsx
// components/ui/gallery-grid.tsx
'use client';

import { useImages } from '@/lib/hooks/use-images';
import { ImageCard } from '@/components/image-card';

export function Gallery() {
  const { images, isLoading, error } = useImages();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading images</div>;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map(image => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
}
```

### Image Detail Component

The Image Detail component displays detailed information about a specific image and provides download functionality:

```tsx
// components/image-detail.tsx
'use client';

import Image from 'next/image';
import { DownloadButton } from './download-button';

export function ImageDetail({ image }) {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-2/3">
        <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden">
          <Image
            src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${image.url}`}
            alt={image.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
      
      <div className="md:w-1/3">
        <h1 className="text-2xl font-bold mb-2">{image.title}</h1>
        <p className="text-gray-600 mb-4">By {image.photographer}</p>
        <p className="mb-6">{image.description}</p>
        
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">Downloads:</span>
          <span className="font-medium">{image.download_count.toLocaleString()}</span>
        </div>
        
        <DownloadButton imageId={image.id} />
      </div>
    </div>
  );
}
```

### Download Counter Component

The Download Counter component displays the total number of downloads across the platform:

```tsx
// components/ui/counter.tsx
'use client';

import { useState, useEffect } from 'react';
import { getStats } from '@/lib/api';

export function DownloadCounter() {
  const [stats, setStats] = useState({ totalDownloads: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchStats();
    
    // Set up polling to update the counter
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
      <span className="text-sm mr-2">Total Downloads</span>
      <span className="font-bold text-xl">
        {isLoading ? '...' : stats.totalDownloads.toLocaleString()}
      </span>
    </div>
  );
}
```

## API Integration

The API client provides methods to interact with the backend:

```tsx
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

export async function getImages() {
  return fetchAPI('/images');
}

export async function getImageById(id) {
  return fetchAPI(`/images/${id}`);
}

export async function downloadImage(imageId) {
  return fetchAPI('/downloads', {
    method: 'POST',
    body: JSON.stringify({ image_id: imageId }),
  });
}

export async function getStats() {
  return fetchAPI('/stats');
}
```

## Internationalization

The application supports multiple languages through the Next.js internationalization system:

```tsx
// middleware.ts.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supportedLocales = ['en', 'zu', 'xh', 'af'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Check if the pathname already includes a locale
  const pathnameHasLocale = supportedLocales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) return NextResponse.next();
  
  // Determine preferred locale from header or default
  const acceptLanguage = request.headers.get('accept-language') || defaultLocale;
  const preferredLocale = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim())
    .find(lang => supportedLocales.includes(lang.substring(0, 2))) || defaultLocale;
  
  // Rewrite URL with locale prefix
  return NextResponse.rewrite(
    new URL(`/${preferredLocale}${pathname}`, request.url)
  );
}

export const config = {
  matcher: [
    // Skip API routes and static files
    '/((?!api|_next/static|favicon.ico).*)',
  ],
};
```

## Deployment

### Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t thirteenk-frontend .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 --env-file .env.production thirteenk-frontend
   ```

### Production Environment Variables

For production deployment, set the following environment variables:

```
NEXT_PUBLIC_API_URL=https://api.thirteenk.co.za/api
NEXT_PUBLIC_STORAGE_URL=https://storage.googleapis.com/thirteenk-images
```

## Development Guidelines

1. **Coding Standards**
   - Follow TypeScript best practices
   - Use functional components with hooks
   - Implement proper error handling
   - Write meaningful comments

2. **Component Development**
   - Create reusable components in the `components` directory
   - Use TypeScript interfaces for props
   - Implement proper loading states
   - Ensure responsive design

3. **Performance Optimization**
   - Use Next.js Image component for optimized images
   - Implement proper caching strategies
   - Minimize bundle size
   - Use React.memo for expensive components

4. **Accessibility**
   - Ensure WCAG 2.1 AA compliance
   - Provide proper alt text for images
   - Implement keyboard navigation
   - Test with screen readers

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Create a Pull Request

## License

Copyright © 2025 Thirteenk. All rights reserved.
