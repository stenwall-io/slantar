// secure all pages
export { default } from 'next-auth/middleware';

export const config = {
    matcher: [
      // ignore auth and api routes
      '/((?!auth|api).*)',
    ],
  }
