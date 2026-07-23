# Deploying the frontend

## 1. Push this repo to GitHub

Same as the backend - separate repo (or a subfolder of a monorepo, your
call):
```
git init
git add .
git commit -m "FlashBook frontend"
git remote add origin <your-github-repo-url>
git push -u origin main
```

## 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com), sign up free (GitHub login is
   the easy path).
2. Add New → Project, import your frontend repo. Vercel auto-detects
   Next.js - you shouldn't need to change any build settings.
3. Before deploying, add an environment variable:
   - `NEXT_PUBLIC_API_URL` = your deployed backend's URL (e.g.
     `https://flashbook-api.onrender.com`) - **no trailing slash**.
4. Deploy.

## 3. Update the backend's CORS setting

Once you have your Vercel URL (something like
`https://flashbook-frontend.vercel.app`), go back to the Render dashboard
for the backend and set `CORS_ORIGIN` to that exact URL - see the backend's
`DEPLOY.md` step 6. Without this, the deployed frontend's requests to the
backend will be blocked by the browser's CORS policy even though everything
looks fine when testing locally (local dev works because `CORS_ORIGIN`
defaults to `*` when unset).

## 4. Verify it's live

Open your Vercel URL. You should see the home page load, and if the
backend has any live drops, they should appear in the gallery. If the page
loads but no drops show and the browser console shows a CORS or network
error, double check step 3.

## Custom domain (optional)

Vercel's free tier includes free `*.vercel.app` subdomains, which is fine
for a portfolio project - a custom domain isn't necessary but can be added
for free later under Project Settings → Domains if you own one.

## What "done" looks like for the resume

Once both are live: `https://your-frontend.vercel.app` is the link you'd
put in a portfolio or resume. Along with the load test numbers from Phase
6, that's the "live demo link" the SRS's Phase 7 deliverable calls for.
