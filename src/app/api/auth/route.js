import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
console.log("ROUTE code", code)
  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    await supabase.auth.exchangeCodeForSession(code);
  }
  // URL to redirect to after sign in process completes
  console.log("ROUTE RequestUrl", requestUrl)
  const redirectPath = requestUrl.searchParams.get('redirectedFrom');
  console.log("ROUTE redirectpath", redirectPath)

  return NextResponse.redirect(`${requestUrl.origin}/${redirectPath}`);
}
