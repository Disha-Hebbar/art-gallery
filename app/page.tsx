import { Header } from '@/components/header'
import { Gallery } from '@/components/gallery'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Art Gallery
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground text-balance">
            A curated collection of original artworks. Each piece tells a unique story.
          </p>
        </div>
        <Gallery />
      </main>
      <footer className="border-t py-8">
        <p className="text-center text-sm text-muted-foreground">
          All artworks are original creations
        </p>
      </footer>
    </div>
  )
}
