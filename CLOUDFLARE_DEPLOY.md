# Deploying to Cloudflare Pages

This guide explains how to deploy the NEAR by Example frontend to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account
2. Your repository connected to Cloudflare Pages

## Deployment Steps

### 1. Build Configuration

The project is configured to build with:
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node version:** 18 or higher

### 2. SPA Routing Configuration

The project includes two methods to handle Single Page Application (SPA) routing:

#### Method 1: `_redirects` file (Recommended)
- Location: `public/_redirects`
- Automatically copied to `dist/_redirects` during build
- Format: `/*    /index.html   200`

#### Method 2: Cloudflare Pages Functions
- Location: `functions/_middleware.ts`
- Handles routing at the edge
- Automatically deployed with your site

### 3. Environment Variables

If you need to override the backend URL, set the environment variable in Cloudflare Pages:
- **Variable name:** `VITE_API_URL`
- **Value:** Your backend URL (e.g., `https://near-by-example-backend.fly.dev`)

### 4. Deploy via Cloudflare Dashboard

1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project"
3. Connect your Git repository
4. Configure build settings:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Add environment variables if needed
6. Click "Save and Deploy"

### 5. Custom Domain Setup

1. In your Cloudflare Pages project, go to "Custom domains"
2. Add your domain (e.g., `near.peersurf.xyz`)
3. Follow the DNS configuration instructions
4. Wait for DNS propagation

## Troubleshooting

### 404 Errors on Routes

If you're getting 404 errors on routes like `/examples`:

1. **Verify `_redirects` file exists in `dist`** after build
2. **Check Cloudflare Pages Functions** are enabled
3. **Clear Cloudflare cache** after deployment
4. **Verify the middleware** is deployed correctly

### Build Failures

- Ensure Node.js version is 18+
- Check that all dependencies are in `package.json`
- Verify build command works locally: `npm run build`

## Files Included

- `public/_redirects` - Netlify/Cloudflare compatible redirects
- `functions/_middleware.ts` - Cloudflare Pages Functions middleware
- `wrangler.jsonc` - Cloudflare Workers/Pages configuration (optional)

