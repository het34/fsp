import { getToken } from './auth'

// Reusable fetch wrapper that automatically adds the Bearer token to headers
// and throws clear errors if the response isn't successful.
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()

  const headers = new Headers(options.headers)
  headers.set('Content-Type', 'application/json')
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok || !data.success) {
    // If our backend returns a specific error message, throw it
    throw new Error(data.message || 'An API error occurred')
  }

  // Our backend wraps the response data in `data`, so we return `data.data`
  return data.data as T
}
