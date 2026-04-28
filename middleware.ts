import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// The pages that require the user to be logged in
const protectedRoutes = ['/dashboard']
// The pages that are for public/unauthenticated users (like login)
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
  // Check if there is a token stored in the cookies
  const token = request.cookies.get('token')?.value

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  )

  // 1. If accessing a protected route without a token, redirect to /login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 2. If accessing login/register WITH a token, redirect to /dashboard
  if (isAuthRoute && token) {
    const dashboardUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // 3. Otherwise, proceed as normal
  return NextResponse.next()
}

// Ensure the middleware only runs on specific paths to improve performance
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
}
