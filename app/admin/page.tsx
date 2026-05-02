import { Header } from '@/components/header'
import { AdminPanel } from '@/components/admin-panel'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Upload and manage your artwork collection
          </p>
        </div>
        <AdminPanel />
      </main>
    </div>
  )
}
