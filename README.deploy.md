Deployment guide

- Frontend (SPA) deployment:
  - Platform: Vercel or Netlify
  - Ensure build script runs as npm run build and outputs to dist
  - For Vercel: vercel.json is present to serve SPA with fallback to index.html
  - For Netlify: netlify.toml configured to publish dist and fallback to index.html

- Backend proxy deployment:
  - Platform: any provider capable of running Node.js (Heroku, AWS, DigitalOcean, Render, etc.)
  - Deploy server with GEMINI_API_KEY set in the environment (or PROXY_API_KEY for header protection)
  - Ensure ALLOWED_ORIGINS is set appropriately to whitelist frontend domains
  - Endpoints: POST /parse-drink (requires X-API-KEY header if PROXY_API_KEY is configured)

- Security considerations:
  - Do not expose GEMINI_API_KEY in client-side code; the proxy handles all Gemini calls.
  - Use a strong API key for the proxy (set PROXY_API_KEY) and require it in requests.
  - Restrict origins with ALLOWED_ORIGINS.
