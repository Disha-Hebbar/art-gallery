'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Palette, Settings, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Header() {
  const pathname = usePathname()
  const isAdmin = pathname === '/admin'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Palette className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Gallery
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button
            variant={isAdmin ? 'ghost' : 'default'}
            size="sm"
            asChild
            className={cn(!isAdmin && 'pointer-events-none')}
          >
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Gallery
            </Link>
          </Button>
          <Button
            variant={isAdmin ? 'default' : 'ghost'}
            size="sm"
            asChild
            className={cn(isAdmin && 'pointer-events-none')}
          >
            <Link href="/admin">
              <Settings className="mr-2 h-4 w-4" />
              Admin
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
