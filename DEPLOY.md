# Deploy to Cloudflare Workers

This project is a static SPA built with Vite, React, and TanStack Router. It deploys as a Cloudflare Worker serving static assets.

## Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up)
- Your code pushed to a GitHub repository

## Method 1: Deploy via GitHub (recommended)

This is the zero-config approach. Cloudflare watches your repo and auto-deploys on every push to `main`.

1. Go to [Workers & Pages](https://dash.cloudflare.com/?to=/:account/workers-and-pages) in the Cloudflare dashboard.

2. Click **Create application** → **Import a repository**.

3. Connect your GitHub account and select this repository.

4. Cloudflare will auto-detect the framework (Vite). It reads the build settings from `wrangler.toml` — you don't need to configure anything manually.

5. Click **Save and Deploy**. The first deploy will run the build and ship it to `*.workers.dev`.

6. Every future push to `main` will trigger an automatic deploy.

### What `wrangler.toml` does

```toml
name = "personal-website"
compatibility_date = "2025-07-11"

[assets]
directory = "./dist"
not_found_handling = "single-page-application"
```

- `assets.directory` — tells Cloudflare where the built files live (`./dist`)
- `not_found_handling = "single-page-application"` — serves `index.html` for any route that doesn't match a file, which TanStack Router needs for client-side routing
- No Worker script needed — this is a pure static site

**Important:** The `name` in `wrangler.toml` must match the Worker name in Cloudflare's dashboard. If you rename the project, update both.

## Method 2: Deploy via CLI

For one-off deploys or testing from your machine:

```bash
npm install
npm run deploy
```

This runs `tsc -b && vite build` then `wrangler deploy`.

First time, Wrangler will open a browser to log in to your Cloudflare account.

## Custom domain

Once deployed, you can attach a custom domain:

1. In the dashboard, go to your Worker → **Settings** → **Domains & Routes**.
2. Add your domain (the domain must be on Cloudflare DNS).
3. Cloudflare handles SSL automatically.

## Build settings reference (if you need to configure manually)

When importing the repo, these are set automatically. If you ever need to set them manually:

| Setting | Value |
|---------|-------|
| Framework preset | None (or Vite) |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` (repository root) |
| Build output directory | `./dist` |

## Troubleshooting

**Build fails with "Worker name mismatch":** The `name` in `wrangler.toml` must match exactly what's shown in the Cloudflare dashboard for this Worker.

**404 on page refresh:** If `not_found_handling` is not set to `single-page-application`, TanStack Router's client-side routes will 404 on direct navigation. The setting is already in `wrangler.toml`.

**523 errors after first deploy:** Wait 1–2 minutes. DNS propagation for `*.workers.dev` subdomains takes a moment on first deploy.
