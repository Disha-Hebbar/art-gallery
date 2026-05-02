'use client'

import { useState } from 'react'
import Image from 'next/image'
import useSWR from 'swr'
import type { Artwork } from '@/lib/types'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { X, ZoomIn, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function Gallery() {
  const { data, isLoading } = useSWR<{ artworks: Artwork[] }>('/api/artworks', fetcher)
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] animate-pulse rounded-xl bg-muted"
          />
        ))}
      </div>
    )
  }

  const artworks = data?.artworks || []

  if (artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-4 rounded-full bg-muted p-6">
          <Palette className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-medium text-foreground">No artworks yet</h3>
        <p className="mt-2 text-muted-foreground">
          Check back soon for new pieces
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        {artworks.map((artwork, index) => (
          <div
            key={artwork.id}
            className={cn(
              "group relative mb-6 cursor-pointer overflow-hidden rounded-xl break-inside-avoid",
              "transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
            )}
            onClick={() => setSelectedArtwork(artwork)}
          >
            <div className="relative">
              <Image
                src={artwork.url}
                alt="Artwork"
                width={600}
                height={800}
                className="w-full object-cover"
                priority={index < 3}
              />
              <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20" />
              <div className="absolute right-3 top-3 rounded-full bg-white/20 p-2 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                <ZoomIn className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedArtwork} onOpenChange={() => setSelectedArtwork(null)}>
        <DialogContent className="max-w-5xl border-0 bg-transparent p-0 shadow-none">
          <DialogTitle className="sr-only">Artwork</DialogTitle>
          {selectedArtwork && (
            <div className="relative flex flex-col overflow-hidden rounded-2xl bg-card lg:flex-row">
              <button
                onClick={() => setSelectedArtwork(null)}
                className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative flex-1 bg-black/5">
                <Image
                  src={selectedArtwork.url}
                  alt="Artwork"
                  width={1200}
                  height={1600}
                  className="h-auto max-h-[80vh] w-full object-contain"
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
