'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiRequest } from '@/lib/api'
import { removeToken } from '@/lib/auth'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    // Fetch the currently logged-in user's data
    // The lib/api.ts automatically attaches the token!
    apiRequest('/auth/me')
      .then((data) => setUser(data.user))
      .catch((err) => {
        // If the token is invalid or expired, the backend returns 401
        setError(err.message)
      })
  }, [])

  const handleLogout = () => {
    removeToken()       // Delete cookie
    router.push('/login') // Redirect to login
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
          >
            Logout
          </button>
        </div>

        {error ? (
          <div className="p-4 bg-red-100 text-red-700 rounded text-center">
            {error}
          </div>
        ) : !user ? (
          <p className="text-gray-500 text-center py-8 animate-pulse">Loading your data...</p>
        ) : (
          <div className="space-y-4 text-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-black">Welcome back, {user.name}!</h2>
            <div className="p-4 bg-gray-100 rounded">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">Your Email</p>
              <p className="text-lg">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
