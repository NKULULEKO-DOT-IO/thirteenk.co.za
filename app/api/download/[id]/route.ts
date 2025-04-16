import { NextRequest, NextResponse } from 'next/server';

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
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://thirteenkapi-service-hii3wfspiq-uc.a.run.app/api/v1';
    const downloadUrl = `${apiUrl}/downloads/${id}`;

    // Make the request from the server side
    const response = await fetch(downloadUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Return the download URL to the client
    return NextResponse.json({ download_url: data.download_url });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Failed to initiate download' }, { status: 500 });
  }
}