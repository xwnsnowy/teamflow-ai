import { detectBot } from '@/lib/arcjet';
import arcjet, { createMiddleware } from '@arcjet/next';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    detectBot({
      mode: 'LIVE',
      allow: ['CATEGORY:SEARCH_ENGINE', 'CATEGORY:PREVIEW', 'CATEGORY:WEBHOOK', 'CATEGORY:MONITOR'],
    }),
  ],
});

async function existingMiddleware(req: NextRequest) {
  const { getClaim } = getKindeServerSession();
  const orgCode = await getClaim('org_code');

  const url = req.nextUrl;

  if (url.pathname.startsWith('/workspace') && !url.pathname.includes(orgCode?.value || '')) {
    url.pathname = `/workspace/${orgCode?.value || 'default'}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export default createMiddleware(aj, existingMiddleware);

export const config = {
  // matcher tells Next.js which routes to run the middleware on.
  // This runs the middleware on all routes except for static assets.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|/rpc).*)'],
};
