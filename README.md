# Streetwear store (Next.js + Supabase)

Orders happen over Instagram DM. No payments are processed on the site.

## 1. Run the website
Needs Node.js 18+.
```
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
```
## 2. Connect Supabase
1. Create a free project at supabase.com.
2. **SQL Editor**: paste and run `supabase/schema.sql` (tables, security rules, image bucket).
3. Optional: run `supabase/seed_demo.sql` for 4 demo products (delete them later in Admin).
4. **Project Settings > API**: copy *Project URL* and *anon public key* into `.env.local`. Restart `npm run dev`.
5. Only the anon key is ever used. Never put the `service_role` key in this project.

## 3. Create your admin account
1. Supabase > **Authentication > Users > Add user**: enter your email and a strong password, tick "Auto confirm".
2. In **Authentication > Providers > Email**, turn OFF "Allow new users to sign up" so nobody else can register.
3. SQL Editor, run (with your email):
   `insert into public.admin_users select id from auth.users where email = 'you@example.com';`
4. Open `/admin` and sign in. Security rules in the database stop everyone else from changing data.

## 4. Add products
Admin > Products > **Add product**. Upload photos, set sizes and stock (0 stock hides a size), tick **Published**, save. Untick Published to keep a draft. Delete the `[DEMO]` products when ready. Changes appear within about 30 seconds.

## 5. Change your Instagram username
Admin > **Settings** > Instagram username. The same page holds delivery, returns, privacy, terms, FAQ, contact details and the announcement bar. Write your own real policies; nothing is pre-filled.

How ordering works: Buy now checks size/colour, builds the message, copies it and opens `ig.me/m/<username>`. Instagram cannot be pre-filled from a website, so the customer pastes and sends it. The site never claims a message was sent.

## 6. Publish online (Cloudflare Workers, free)
See `CLOUDFLARE.md`. (Vercel also works, see below.)

### Alternative: Vercel
1. Push the project to GitHub.
2. vercel.com > **Add New Project** > import the repo.
3. Add environment variables `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL` (your final https address).
4. Deploy, then add your own domain under Project > Domains. Put the link in your Instagram bio.

## Not included
Newsletter signup, sitemap, and page-to-page animated transitions (pages fade in instead).
