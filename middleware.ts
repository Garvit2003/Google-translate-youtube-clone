import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
 
const isDashboardRoute = createRouteMatcher(['/dashboard(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)']);
 
export default clerkMiddleware((auth, req) => {
  if (isAdminRoute(req)) auth().protect({ role: 'org:admin' });
 
  if (isDashboardRoute(req)) auth().protect();
});
 
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};