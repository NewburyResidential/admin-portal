import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  console.log("MIDDLE pathname",req.nextUrl.pathname)
  if (req.nextUrl.pathname === '/api/auth/') {
    console.log("MIDDLE IGNORED")
    return NextResponse.next(); 
  }
  console.log("MIDDLE NOT IGNORED")

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession();
  console.log("MIDDLE NOT session", session)
  
  if (session?.user?.email) {
    return res
  }
  const redirectUrl = req.nextUrl.clone()
  console.log("MIDDLE redirectUrl", redirectUrl)
  redirectUrl.pathname = '/auth/login'
  redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'] // PROTECTED_ROUTES
}