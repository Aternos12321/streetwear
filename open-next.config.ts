import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No R2 / KV / Durable Objects: every data page is rendered fresh on request,
// so nothing here needs a paid or card-verified Cloudflare product.
export default defineCloudflareConfig();
