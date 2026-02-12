<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/135I1I0eyvE7JOeB9QTFxliTPEGznspIQ

Environment & setup
- Use environment variables for secrets. Do not commit real keys.
- Example: create a local env file at ".env.local" with VITE_API_KEY=your_key
- A template example is available at ".env.example". Copy it to ".env.local" and replace the placeholder.
- The Gemini AI integration reads VITE_API_KEY from import.meta.env.VITE_API_KEY (via Vite).

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set environment keys:
   - For frontend Gemini usage, copy .env.example to .env.local and set VITE_API_KEY
   - For backend Gemini proxy, export GEMINI_API_KEY in your environment
3. Run the frontend:
   `npm run dev`
4. Run the backend proxy (optional but recommended for production):
   `npm run start:server`
