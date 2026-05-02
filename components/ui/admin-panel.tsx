'use client'

import { useState } from 'react'
import Image from 'next/image'
import useSWR, { useSWRConfig } from 'swr'
import type { Artwork } from '@/lib/types'
import { UploadForm } from './upload-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2, Image as ImageIcon, Calendar, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function AdminPanel() {
  const { data, isLoading } = useSWR<{ artworks: Artwork[] }>('/api/artworks', fetcher)
  const { mutate } = useSWRConfig()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (artwork: Artwork) => {
    setDeletingId(artwork.id)
    try {
      const response = await fetch('/api/artworks/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: artwork.url }),
      })

      if (!response.ok) throw new Error('Delete failed')

      mutate('/api/artworks')
    } catch (error) {
      console.error('Delete error:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const artworks = data?.artworks || []

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Upload Section */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Upload New Artwork
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UploadForm />
        </CardContent>
      </Card>

      {/* Manage Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Artworks</span>
            <span className="text-sm font-normal text-muted-foreground">
              {artworks.length} {artworks.length === 1 ? 'piece' : 'pieces'}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-20 w-20 animate-pulse rounded-lg bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : artworks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 rounded-full bg-muted p-4">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No artworks uploaded yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Use the form to upload your first piece
              </p>
            </div>
          ) : (
            <div className="max-h-[500px] space-y-4 overflow-y-auto pr-2">
              {artworks.map((artwork) => (
                <div
                  key={artwork.id}
                  className="group flex gap-4 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={artwork.url}
                      alt="Artwork"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(artwork.uploadedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                      >
                        {deletingId === artwork.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete artwork?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this artwork from your
                          gallery. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(artwork)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
