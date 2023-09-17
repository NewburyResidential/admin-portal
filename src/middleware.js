import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  if (req.nextUrl.pathname === '/api/auth/') {
    return NextResponse.next(); 
  }
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user?.email) {
    return res
  }
  const redirectUrl = req.nextUrl.clone()
  redirectUrl.pathname = '/auth/login'
  redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'] // PROTECTED_ROUTES
}