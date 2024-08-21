export { default } from 'next-auth/middleware';



export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*', '/', '/onboarding/:path*'] // PROTECTED_ROUTES
};
