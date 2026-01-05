export async function onRequest(context: {
  request: Request;
  next: () => Promise<Response>;
  env: any;
}): Promise<Response> {
  const url = new URL(context.request.url);
  
  // If the request is for a static asset (has an extension), serve it normally
  if (url.pathname.match(/\.[\w]+$/)) {
    return context.next();
  }
  
  // For all other routes (SPA routes), rewrite to index.html
  const rewrittenUrl = new URL('/index.html', context.request.url);
  const rewrittenRequest = new Request(rewrittenUrl, context.request);
  
  return context.next({
    request: rewrittenRequest
  });
}

