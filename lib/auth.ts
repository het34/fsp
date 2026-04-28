// Basic helper to set, get, and remove the JWT cookie on the client side.

export function setToken(token: string) {
  // Storing the token in a cookie so the Next.js middleware can read it easily.
  // We set a max-age of 7 days (in seconds) to match our backend expiration.
  document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`
}

export function getToken(): string | null {
  if (typeof document === 'undefined') return null
  
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'))
  if (match) return match[2]
  return null
}

export function removeToken() {
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}
