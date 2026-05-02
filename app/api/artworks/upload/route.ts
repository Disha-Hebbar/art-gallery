import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Create a unique filename with timestamp
    const timestamp = Date.now()
    const filename = `artworks/${timestamp}-${file.name}`

    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type,
    })

    return NextResponse.json({
      success: true,
      artwork: {
        id: blob.pathname,
        url: blob.url,
        pathname: blob.pathname,
        uploadedAt: new Date().toISOString(),
        size: file.size,
      },
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
