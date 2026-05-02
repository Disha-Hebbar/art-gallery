import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'
import type { Artwork } from '@/lib/types'

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: 'artworks/',
    })

    const artworks: Artwork[] = blobs.map((blob) => ({
      id: blob.pathname,
      url: blob.url,
      pathname: blob.pathname,
      title: (blob as { metadata?: { title?: string } }).metadata?.title || 'Untitled',
      description: (blob as { metadata?: { description?: string } }).metadata?.description || '',
      medium: (blob as { metadata?: { medium?: string } }).metadata?.medium || '',
      year: (blob as { metadata?: { year?: string } }).metadata?.year || '',
      uploadedAt: blob.uploadedAt.toISOString(),
      size: blob.size,
    }))

    // Sort by upload date, newest first
    artworks.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())

    return NextResponse.json({ artworks })
  } catch (error) {
    console.error('Error listing artworks:', error)
    return NextResponse.json({ error: 'Failed to list artworks' }, { status: 500 })
  }
}
