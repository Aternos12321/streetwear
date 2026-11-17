# Publishing on Cloudflare Workers (free)

Adapter: OpenNext for Cloudflare (`@opennextjs/cloudflare`) on Next.js 16.
Files added for this: `wrangler.jsonc`, `open-next.config.ts`, `public/_headers`.
Worker name is `streetwear-store`. If you change it in `wrangler.jsonc`, change BOTH places
(`name` and `services[0].service`).

## Easiest way on Windows: GitHub + Cloudflare dashboard (nothing to install)
1. Create a free account at github.com. Click **New repository**, name it `streetwear-store`, choose Private, create it.
2. Unzip `streetwear-store-cloudflare.zip`. On the new repository page click **uploading an existing file**, drag in everything INSIDE the unzipped `streetwear-store` folder (not the folder itself), then click **Commit changes**. If GitHub limits the upload, do it in two batches.
3. Create a free account at dash.cloudflare.com.
4. Open **Workers & Pages**, click **Create application**, choose **Import a repository** (Git), connect GitHub and pick `streetwear-store`.
5. Project name: `streetwear-store` (must match `wrangler.jsonc`).
6. Build command: `npx opennextjs-cloudflare build`
   Deploy command: `npx opennextjs-cloudflare deploy`
7. Open **Variables** (build variables) and add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon public key
   - `NEXT_PUBLIC_SITE_URL` = leave empty for now
   - `NODE_VERSION` = `22`
8. Click **Save and Deploy**. The first build takes a few minutes.
9. When it succeeds, open the project > **Settings > Domains & Routes**. Your link is
   `https://streetwear-store.YOUR-SUBDOMAIN.workers.dev`. On first use Cloudflare asks you to choose the `YOUR-SUBDOMAIN` part.
10. Go back to Variables, set `NEXT_PUBLIC_SITE_URL` to that link, then trigger a new build
    (**Deployments > Retry build**). Variables starting with NEXT_PUBLIC are baked in at build time,
    so ANY change to them needs a new build.

## Supabase
Nothing changes: run `supabase/schema.sql`, create your admin user, and add yourself to `admin_users` (see README.md steps 2 and 3).
Login, product data, image uploads and the admin dashboard all talk to Supabase directly.

## Updating the site later
Change files on GitHub (or upload new ones). Cloudflare rebuilds and publishes automatically.
Products, prices and settings are edited in /admin and need no redeploy.

## Free plan limits
- Worker size 3 MiB (compressed) and 10 ms CPU per request. A server-rendered Next.js page can sometimes pass 10 ms.
  Symptom: occasional error 1102 / "exceeded CPU". The only fix inside Cloudflare is the $5/month Workers Paid plan.
- Static files (JS, CSS, fonts) are served free and do not count as Worker requests.
- No R2/KV is used, so no card is required.
