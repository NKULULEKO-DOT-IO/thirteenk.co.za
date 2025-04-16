import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/app/config';

/**
 * API route handler for downloading image files
 * This performs the download on the server side to handle CORS issues
 * and ensures all download tracking is properly recorded
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const id = params.id;

  if (!id) {
    return NextResponse.json({ error: 'Invalid image ID' }, { status: 400 });
  }

  try {
    // Use the config for API URL
    const apiBaseUrl = config.apiBaseUrl;
    const downloadUrl = `${apiBaseUrl}/downloads/${id}`;

    // Get the download URL from your API
    const response = await fetch(downloadUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Ensure download URL is HTTPS
    let secureDownloadUrl = data.download_url;
    if (secureDownloadUrl.startsWith('http:')) {
      secureDownloadUrl = secureDownloadUrl.replace(/^http:/i, 'https:');
    }

    console.log(`Fetching file from: ${secureDownloadUrl}`);

    // Now fetch the actual file
    const fileResponse = await fetch(secureDownloadUrl, {
      cache: 'no-store',
      // Add a longer timeout for large files
      signal: AbortSignal.timeout(30000) // 30 seconds
    });

    if (!fileResponse.ok) {
      throw new Error(`Failed to fetch file: ${fileResponse.status} ${fileResponse.statusText}`);
    }

    // Get the file data as an array buffer
    const fileArrayBuffer = await fileResponse.arrayBuffer();

    // Get content type
    const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';

    // Attempt to get the filename from the Content-Disposition header
    let filename = `image-${id}.jpg`;
    const contentDisposition = fileResponse.headers.get('content-disposition');
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+?)"/i);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }

    // Create and return a new Response with the file data
    return new NextResponse(fileArrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({
      error: 'Failed to download file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}